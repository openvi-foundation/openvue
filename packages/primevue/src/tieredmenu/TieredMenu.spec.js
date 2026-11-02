import { mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import TieredMenu from './TieredMenu.vue';

describe('TieredMenu.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(TieredMenu, {
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
                        items: [{ label: 'New' }, { label: 'Open' }]
                    },
                    { separator: true },
                    { label: 'Quit' }
                ]
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.p-tieredmenu.p-component').exists()).toBe(true);
        expect(wrapper.findAll('[role="menuitem"]').length).toBe(2);
    });

    it('should omit aria-level and keep setsize/posinset skipping separators', () => {
        const menuitems = wrapper.findAll('[role="menuitem"]');

        expect(menuitems.length).toBe(2);
        menuitems.forEach((item) => {
            expect(item.attributes('aria-level')).toBeUndefined();
            expect(item.attributes('aria-setsize')).toBe('2');
        });
        expect(menuitems[0].attributes('aria-label')).toBe('File');
        expect(menuitems[0].attributes('aria-posinset')).toBe('1');
        expect(menuitems[1].attributes('aria-label')).toBe('Quit');
        expect(menuitems[1].attributes('aria-posinset')).toBe('2');
    });
});

describe('TieredMenu.vue safe triangle', () => {
    let wrapper;

    const rect = (left, top, right, bottom) => () => ({ left, top, right, bottom, width: right - left, height: bottom - top });

    const pointerMove = (x, y) => {
        const event = new MouseEvent('pointermove', { clientX: x, clientY: y });

        Object.defineProperty(event, 'pointerType', { value: 'mouse' });
        document.dispatchEvent(event);
    };

    const itemContent = (index) => wrapper.findAll('[data-pc-section="itemcontent"]')[index];

    const isActive = (label) => wrapper.find(`li[aria-label="${label}"]`).attributes('data-p-active') === 'true';

    // root items are stacked 40px rows, File's submenu opens to their right
    beforeEach(async () => {
        vi.useFakeTimers();

        wrapper = mount(TieredMenu, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    'router-link': true,
                    teleport: true
                }
            },
            props: {
                model: [{ label: 'File', items: [{ label: 'New' }, { label: 'Open' }] }, { label: 'Edit', items: [{ label: 'Cut' }] }, { label: 'Quit' }]
            }
        });

        await itemContent(0).trigger('click');

        itemContent(0).element.getBoundingClientRect = rect(0, 0, 100, 40);
        itemContent(3).element.getBoundingClientRect = rect(0, 40, 100, 80);
        wrapper.find('li[aria-label="File"] > [data-pc-section="submenu"]').element.getBoundingClientRect = rect(100, 0, 250, 120);
    });

    afterEach(() => {
        wrapper.unmount();
        vi.useRealTimers();
    });

    it('should keep the submenu open while moving diagonally towards it', async () => {
        pointerMove(90, 30);
        await itemContent(3).trigger('mouseenter', { clientX: 95, clientY: 45 });
        pointerMove(95, 45);

        expect(isActive('File')).toBe(true);
        expect(isActive('Edit')).toBe(false);

        pointerMove(105, 50);
        vi.advanceTimersByTime(300);
        await wrapper.vm.$nextTick();

        expect(isActive('File')).toBe(true);
        expect(isActive('Edit')).toBe(false);
    });

    it('should read the direction from further back than the last 1px steps', async () => {
        // heading towards the submenu overall, but the last few steps go straight down
        pointerMove(84, 34);
        pointerMove(87, 37);
        pointerMove(89, 38);
        pointerMove(89, 39);
        pointerMove(89, 40);
        await itemContent(3).trigger('mouseenter', { clientX: 89, clientY: 41 });

        expect(isActive('File')).toBe(true);
        expect(isActive('Edit')).toBe(false);
    });

    it('should switch immediately when moving away from the submenu', async () => {
        pointerMove(50, 30);
        await itemContent(3).trigger('mouseenter', { clientX: 50, clientY: 45 });

        expect(isActive('File')).toBe(false);
        expect(isActive('Edit')).toBe(true);
    });

    it('should switch once the pointer rests on the sibling', async () => {
        pointerMove(90, 30);
        await itemContent(3).trigger('mouseenter', { clientX: 95, clientY: 45 });
        pointerMove(95, 45);

        expect(isActive('Edit')).toBe(false);

        vi.advanceTimersByTime(300);
        await wrapper.vm.$nextTick();

        expect(isActive('File')).toBe(false);
        expect(isActive('Edit')).toBe(true);
    });

    it('should switch when the pointer leaves the safe area over the sibling', async () => {
        pointerMove(90, 30);
        await itemContent(3).trigger('mouseenter', { clientX: 95, clientY: 45 });
        pointerMove(95, 45);

        expect(isActive('Edit')).toBe(false);

        pointerMove(60, 60);
        await wrapper.vm.$nextTick();

        expect(isActive('File')).toBe(false);
        expect(isActive('Edit')).toBe(true);
    });
});
