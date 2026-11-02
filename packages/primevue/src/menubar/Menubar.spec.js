import { mount } from '@vue/test-utils';
import Menubar from './Menubar.vue';

describe('Menubar.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(Menubar, {
            global: {
                stubs: {
                    'router-link': true
                }
            },
            props: {
                model: [
                    {
                        label: 'File',
                        icon: 'pi pi-fw pi-file',
                        items: [
                            {
                                label: 'New',
                                icon: 'pi pi-fw pi-plus',
                                items: [
                                    {
                                        label: 'Bookmark',
                                        icon: 'pi pi-fw pi-bookmark'
                                    },
                                    {
                                        label: 'Video',
                                        icon: 'pi pi-fw pi-video'
                                    }
                                ]
                            },
                            {
                                label: 'Delete',
                                icon: 'pi pi-fw pi-trash'
                            },
                            {
                                separator: true
                            },
                            {
                                label: 'Export',
                                icon: 'pi pi-fw pi-external-link'
                            }
                        ]
                    },
                    {
                        label: 'Quit',
                        icon: 'pi pi-fw pi-power-off'
                    }
                ]
            },
            slots: {
                start: 'Start Slot',
                end: 'End Slot'
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.p-menubar.p-component').exists()).toBe(true);
        expect(wrapper.find('.p-menubar-root-list').exists()).toBe(true);
        expect(wrapper.findAll('ul.p-menubar-submenu').length).toBe(2);
        expect(wrapper.findAll('ul.p-menubar-submenu')[0].findAll('li.p-menubar-item')[0].find('.p-menubar-item-label').text()).toBe('New');
        expect(wrapper.findAll('li.p-menubar-item').length).toBe(7);
        expect(wrapper.findAll('li.p-menubar-separator').length).toBe(1);

        const menuitems = wrapper.findAll('[role="menuitem"]');

        expect(menuitems.length).toBeGreaterThan(0);
        menuitems.forEach((item) => {
            expect(item.attributes('aria-level')).toBeUndefined();
            expect(item.attributes('aria-setsize')).toBeTruthy();
            expect(item.attributes('aria-posinset')).toBeTruthy();
        });

        const exportItem = menuitems.find((item) => item.attributes('aria-label') === 'Export');

        expect(exportItem.attributes('aria-setsize')).toBe('3');
        expect(exportItem.attributes('aria-posinset')).toBe('3');
    });

    it('should slot visible', () => {
        expect(wrapper.find('.p-menubar-start').exists()).toBe(true);
        expect(wrapper.find('.p-menubar-end').exists()).toBe(true);
        expect(wrapper.find('.p-menubar-end').text()).toBe('End Slot');
    });
});

describe('Menubar.vue safe triangle', () => {
    let wrapper;

    const rect = (left, top, right, bottom) => () => ({ left, top, right, bottom, width: right - left, height: bottom - top });

    const pointerMove = (x, y) => {
        const event = new MouseEvent('pointermove', { clientX: x, clientY: y });

        Object.defineProperty(event, 'pointerType', { value: 'mouse' });
        document.dispatchEvent(event);
    };

    const itemContent = (label) => wrapper.find(`li[aria-label="${label}"] > [data-pc-section="itemcontent"]`);

    const isActive = (label) => wrapper.find(`li[aria-label="${label}"]`).attributes('data-p-active') === 'true';

    // root items sit side by side, the submenu under File is wider than File itself
    beforeEach(async () => {
        vi.useFakeTimers();

        wrapper = mount(Menubar, {
            global: {
                stubs: {
                    'router-link': true
                }
            },
            props: {
                model: [
                    { label: 'File', items: [{ label: 'New' }, { label: 'Open' }] },
                    { label: 'Edit', items: [{ label: 'Cut' }] }
                ]
            }
        });

        await itemContent('File').trigger('click');

        itemContent('File').element.getBoundingClientRect = rect(0, 0, 100, 40);
        itemContent('Edit').element.getBoundingClientRect = rect(100, 0, 200, 40);
        wrapper.find('li[aria-label="File"] > [data-pc-section="submenu"]').element.getBoundingClientRect = rect(0, 40, 150, 200);
    });

    afterEach(() => {
        wrapper.unmount();
        vi.useRealTimers();
    });

    it('should keep the submenu open while moving diagonally towards it', async () => {
        pointerMove(95, 30);
        await itemContent('Edit').trigger('mouseenter', { clientX: 105, clientY: 38 });

        expect(isActive('File')).toBe(true);
        expect(isActive('Edit')).toBe(false);
    });

    it('should switch immediately when moving away from the submenu', async () => {
        pointerMove(95, 20);
        await itemContent('Edit').trigger('mouseenter', { clientX: 105, clientY: 20 });

        expect(isActive('File')).toBe(false);
        expect(isActive('Edit')).toBe(true);
    });
});
