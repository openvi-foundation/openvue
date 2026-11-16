import { mount } from '@vue/test-utils';
import MegaMenu from './MegaMenu.vue';

describe('MegaMenu.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(MegaMenu, {
            global: {
                stubs: {
                    'router-link': true
                }
            },
            props: {
                model: [
                    {
                        label: 'Videos',
                        icon: 'pi pi-fw pi-video',
                        items: [
                            [
                                {
                                    label: 'Video 1',
                                    items: [{ label: 'Video 1.1' }, { label: 'Video 1.2' }]
                                },
                                {
                                    label: 'Video 2',
                                    items: [{ label: 'Video 2.1' }, { label: 'Video 2.2' }]
                                }
                            ]
                        ]
                    },
                    {
                        label: 'Users',
                        icon: 'pi pi-fw pi-users',
                        items: [
                            [
                                {
                                    label: 'User 1',
                                    items: [{ label: 'User 1.1' }, { label: 'User 1.2' }]
                                }
                            ],
                            [
                                {
                                    label: 'User 2',
                                    items: [{ label: 'User 2.1' }, { label: 'User 2.2' }]
                                },
                                {
                                    label: 'User 3',
                                    items: [{ label: 'User 3.1' }, { label: 'User 3.2' }]
                                }
                            ]
                        ]
                    }
                ]
            }
        });
    });

    it('should exists', () => {
        expect(wrapper.find('.p-megamenu.p-component').exists()).toBe(true);
        expect(wrapper.find('.p-megamenu-root-list').exists()).toBe(true);
        expect(wrapper.findAll('ul.p-megamenu-submenu').length).toBe(5);
        expect(wrapper.findAll('li.p-megamenu-item').length).toBe(12);
        expect(wrapper.findAll('li.p-megamenu-item')[0].findAll('span.p-megamenu-item-label')[0].text()).toBe('Videos');
        expect(wrapper.findAll('li.p-megamenu-submenu-label')[0].text()).toBe('Video 1');
        expect(wrapper.findAll('li.p-megamenu-item')[1].findAll('span.p-megamenu-item-label')[0].text()).toBe('Video 1.1');

        const menuitems = wrapper.findAll('[role="menuitem"]');

        expect(menuitems.length).toBeGreaterThan(0);
        menuitems.forEach((item) => {
            expect(item.attributes('aria-level')).toBeUndefined();
            expect(item.attributes('aria-setsize')).toBeTruthy();
            expect(item.attributes('aria-posinset')).toBeTruthy();
        });
    });

    it('should select item', async () => {
        const firstItem = wrapper.findAll('li.p-megamenu-item')[0];

        await firstItem.find('.p-megamenu-item-content').trigger('click');

        expect(firstItem.classes()).toContain('p-megamenu-item-active');
    });

    it('should deselect item', async () => {
        const firstItem = wrapper.findAll('li.p-megamenu-item')[0];
        const firstItemContent = firstItem.find('.p-megamenu-item-content');

        await firstItemContent.trigger('click');
        await firstItemContent.trigger('click');

        expect(firstItem.classes()).not.toContain('p-megamenu-item-active');
    });

    it('should orientation work', async () => {
        await wrapper.setProps({ orientation: 'vertical' });

        expect(wrapper.find('.p-megamenu-vertical').exists()).toBe(true);
    });
});

describe('MegaMenu.vue safe triangle', () => {
    let wrapper;

    const rect = (left, top, right, bottom) => () => ({ left, top, right, bottom, width: right - left, height: bottom - top });

    const pointerMove = (x, y) => {
        const event = new MouseEvent('pointermove', { clientX: x, clientY: y });

        Object.defineProperty(event, 'pointerType', { value: 'mouse' });
        document.dispatchEvent(event);
    };

    const itemContent = (label) => wrapper.find(`li[aria-label="${label}"] > [data-pc-section="itemcontent"]`);

    const isActive = (label) => wrapper.find(`li[aria-label="${label}"]`).attributes('data-p-active') === 'true';

    // root items sit side by side, the overlay under File is wider than File itself
    beforeEach(async () => {
        vi.useFakeTimers();

        wrapper = mount(MegaMenu, {
            global: {
                stubs: {
                    'router-link': true
                }
            },
            props: {
                model: [
                    { label: 'File', items: [[{ label: 'Documents', items: [{ label: 'New' }] }]] },
                    { label: 'Edit', items: [[{ label: 'Clipboard', items: [{ label: 'Cut' }] }]] }
                ]
            }
        });

        await itemContent('File').trigger('click');

        itemContent('File').element.getBoundingClientRect = rect(0, 0, 100, 40);
        itemContent('Edit').element.getBoundingClientRect = rect(100, 0, 200, 40);
        wrapper.find('li[aria-label="File"] > [data-pc-section="overlay"]').element.getBoundingClientRect = rect(0, 40, 150, 200);
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
