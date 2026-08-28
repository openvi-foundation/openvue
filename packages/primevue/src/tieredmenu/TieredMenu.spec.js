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
