import { mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import ContextMenu from './ContextMenu.vue';

describe('ContextMenu.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(ContextMenu, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    'router-link': true,
                    teleport: true
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
                        label: 'Edit',
                        icon: 'pi pi-fw pi-pencil',
                        items: [
                            {
                                label: 'Left',
                                icon: 'pi pi-fw pi-align-left'
                            },
                            {
                                label: 'Right',
                                icon: 'pi pi-fw pi-align-right'
                            },
                            {
                                label: 'Center',
                                icon: 'pi pi-fw pi-align-center'
                            },
                            {
                                label: 'Justify',
                                icon: 'pi pi-fw pi-align-justify'
                            }
                        ]
                    },
                    {
                        label: 'Users',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'New',
                                icon: 'pi pi-fw pi-user-plus'
                            },
                            {
                                label: 'Delete',
                                icon: 'pi pi-fw pi-user-minus'
                            },
                            {
                                label: 'Search',
                                icon: 'pi pi-fw pi-users',
                                items: [
                                    {
                                        label: 'Filter',
                                        icon: 'pi pi-fw pi-filter',
                                        items: [
                                            {
                                                label: 'Print',
                                                icon: 'pi pi-fw pi-print'
                                            }
                                        ]
                                    },
                                    {
                                        icon: 'pi pi-fw pi-bars',
                                        label: 'List'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        label: 'Events',
                        icon: 'pi pi-fw pi-calendar',
                        items: [
                            {
                                label: 'Edit',
                                icon: 'pi pi-fw pi-pencil',
                                items: [
                                    {
                                        label: 'Save',
                                        icon: 'pi pi-fw pi-calendar-plus'
                                    },
                                    {
                                        label: 'Delete',
                                        icon: 'pi pi-fw pi-calendar-minus'
                                    }
                                ]
                            },
                            {
                                label: 'Archive',
                                icon: 'pi pi-fw pi-calendar-times',
                                items: [
                                    {
                                        label: 'Remove',
                                        icon: 'pi pi-fw pi-calendar-minus'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        separator: true
                    },
                    {
                        label: 'Quit',
                        icon: 'pi pi-fw pi-power-off'
                    }
                ]
            }
        });
    });

    it('should exist', async () => {
        const event = { pageX: 100, pageY: 120, preventDefault: () => {}, stopPropagation: () => {} };
        const show = vi.spyOn(wrapper.vm, 'show');

        wrapper.vm.show(event);
        await wrapper.setData({ visible: true });

        expect(show).toHaveBeenCalled();
        expect(wrapper.find('.p-contextmenu.p-component').exists()).toBe(true);
        expect(wrapper.findAll('.p-contextmenu-item').length).toBe(5);
        expect(wrapper.findAll('.p-contextmenu-item-label')[0].text()).toBe('File');

        const menuitems = wrapper.findAll('[role="menuitem"]');

        expect(menuitems.length).toBe(5);
        menuitems.forEach((item) => {
            expect(item.attributes('aria-level')).toBeUndefined();
            expect(item.attributes('aria-setsize')).toBe('5');
        });
        expect(menuitems[0].attributes('aria-posinset')).toBe('1');
        expect(menuitems[4].attributes('aria-label')).toBe('Quit');
        expect(menuitems[4].attributes('aria-posinset')).toBe('5');
    });

    it('should hide menu', async () => {
        const hide = vi.spyOn(wrapper.vm, 'hide');

        await wrapper.setData({ visible: true });

        wrapper.vm.hide();
        await wrapper.setData({ visible: false });

        expect(hide).toHaveBeenCalled();
        expect(wrapper.find('.p-contextmenu.p-component').exists()).toBe(false);
    });
});

describe('ContextMenu.vue safe triangle', () => {
    let wrapper;

    const rect = (left, top, right, bottom) => () => ({ left, top, right, bottom, width: right - left, height: bottom - top });

    const pointerMove = (x, y) => {
        const event = new MouseEvent('pointermove', { clientX: x, clientY: y });

        Object.defineProperty(event, 'pointerType', { value: 'mouse' });
        document.dispatchEvent(event);
    };

    const itemContent = (label) => wrapper.find(`li[aria-label="${label}"] > [data-pc-section="itemcontent"]`);

    const isActive = (label) => wrapper.find(`li[aria-label="${label}"]`).attributes('data-p-active') === 'true';

    // root items are stacked 40px rows, File's submenu opens to their right
    beforeEach(async () => {
        vi.useFakeTimers();

        wrapper = mount(ContextMenu, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    'router-link': true,
                    teleport: true
                }
            },
            props: {
                model: [
                    { label: 'File', items: [{ label: 'New' }, { label: 'Open' }] },
                    { label: 'Edit', items: [{ label: 'Cut' }] }
                ]
            }
        });

        await wrapper.setData({ visible: true });
        await itemContent('File').trigger('mouseenter');

        itemContent('File').element.getBoundingClientRect = rect(0, 0, 100, 40);
        itemContent('Edit').element.getBoundingClientRect = rect(0, 40, 100, 80);
        wrapper.find('li[aria-label="File"] > [data-pc-section="submenu"]').element.getBoundingClientRect = rect(100, 0, 250, 120);
    });

    afterEach(() => {
        wrapper.unmount();
        vi.useRealTimers();
    });

    it('should keep the submenu open while moving diagonally towards it', async () => {
        pointerMove(90, 30);
        await itemContent('Edit').trigger('mouseenter', { clientX: 95, clientY: 45 });

        expect(isActive('File')).toBe(true);
        expect(isActive('Edit')).toBe(false);
    });

    it('should switch immediately when moving away from the submenu', async () => {
        pointerMove(50, 30);
        await itemContent('Edit').trigger('mouseenter', { clientX: 50, clientY: 45 });

        expect(isActive('File')).toBe(false);
        expect(isActive('Edit')).toBe(true);
    });
});
