import { mount } from '@vue/test-utils';
import Listbox from 'openvue/listbox';
import PrimeVue from 'openvue/config';
import { nextTick, reactive, toRaw } from 'vue';
import OrderList from './OrderList.vue';

const items = (count) => Array.from({ length: count }, (_, i) => ({ id: i, name: `Item #${i}`, category: 'Accessories', price: i + 0.99 }));

const mountOrderList = (props = {}) =>
    mount(OrderList, {
        global: { plugins: [PrimeVue] },
        props: { responsive: false, ...props },
        slots: { option: '<template #option="{ option }">{{ option.name }}</template>' }
    });

const renderedNames = (wrapper) => wrapper.findAll('li.p-listbox-option').map((option) => option.text());

const selectedNames = (wrapper) =>
    wrapper
        .findAll('li.p-listbox-option')
        .filter((option) => option.attributes('aria-selected') === 'true')
        .map((option) => option.text());

const lastEmitted = (wrapper, event) => wrapper.emitted(event).at(-1)[0];

// Moves the selection with a control button, then hands the new order back like v-model would.
const move = async (wrapper, section) => {
    await wrapper.find(`[data-pc-section="${section}"]`).element.closest('button').click();
    await wrapper.setProps({ modelValue: lastEmitted(wrapper, 'update:modelValue') });
};

describe('OrderList.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(OrderList, {
            global: {
                plugins: [PrimeVue]
            },
            props: {
                modelValue: [
                    {
                        id: '1000',
                        code: 'vbb124btr',
                        name: 'Game Controller',
                        description: 'Product Description',
                        image: 'game-controller.jpg',
                        price: 99,
                        category: 'Electronics',
                        quantity: 2,
                        inventoryStatus: 'LOWSTOCK',
                        rating: 4
                    },
                    {
                        id: '1001',
                        code: 'nvklal433',
                        name: 'Black Watch',
                        description: 'Product Description',
                        image: 'black-watch.jpg',
                        price: 72,
                        category: 'Accessories',
                        quantity: 61,
                        inventoryStatus: 'INSTOCK',
                        rating: 4
                    },
                    {
                        id: '1002',
                        code: 'zz21cz3c1',
                        name: 'Blue Band',
                        description: 'Product Description',
                        image: 'blue-band.jpg',
                        price: 79,
                        category: 'Fitness',
                        quantity: 2,
                        inventoryStatus: 'LOWSTOCK',
                        rating: 3
                    },
                    {
                        id: '1003',
                        code: '244wgerg2',
                        name: 'Blue T-Shirt',
                        description: 'Product Description',
                        image: 'blue-t-shirt.jpg',
                        price: 29,
                        category: 'Clothing',
                        quantity: 25,
                        inventoryStatus: 'INSTOCK',
                        rating: 5
                    },
                    {
                        id: '1004',
                        code: 'h456wer53',
                        name: 'Bracelet',
                        description: 'Product Description',
                        image: 'bracelet.jpg',
                        price: 15,
                        category: 'Accessories',
                        quantity: 73,
                        inventoryStatus: 'INSTOCK',
                        rating: 4
                    },
                    {
                        id: '1005',
                        code: 'cm230f032',
                        name: 'Gaming Set',
                        description: 'Product Description',
                        image: 'gaming-set.jpg',
                        price: 299,
                        category: 'Electronics',
                        quantity: 63,
                        inventoryStatus: 'INSTOCK',
                        rating: 3
                    }
                ]
            },
            slots: {
                header: 'List of Products',
                item: `
                    <template #item="slotProps">
                        <div class="product-item">
                            <div class="image-container">
                                <img :src="'images/product/' + slotProps.item.image" :alt="slotProps.item.name" />
                            </div>
                            <div class="product-list-detail">
                                <h6 class="mb-2">{{slotProps.item.name}}</h6>
                                <i class="pi pi-tag product-category-icon"></i>
                                <span class="product-category">{{slotProps.item.category}}</span>
                            </div>
                            <div class="product-list-action">
                                <h6 class="mb-2">\${{slotProps.item.price}}</h6>
                                <span :class="'product-badge status-'+slotProps.item.inventoryStatus.toLowerCase()">{{slotProps.item.inventoryStatus}}</span>
                            </div>
                        </div>
                    </template>
                `
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.p-orderlist.p-component').exists()).toBe(true);
        expect(wrapper.find('.p-orderlist-controls').exists()).toBe(true);
        expect(wrapper.findAll('li.p-listbox-option').length).toBe(6);
    });

    it('should select item', async () => {
        const listBoxOption = wrapper.find('li.p-listbox-option');

        expect(listBoxOption.classes()).not.toContain('p-listbox-option-selected');

        await listBoxOption.trigger('click');

        expect(wrapper.findAll('li.p-listbox-option')[0].classes()).toContain('p-listbox-option-selected');
    });

    it('should slot works', () => {
        expect(wrapper.find('.p-listbox-header').text()).toBe('List of Products');
        expect(wrapper.findAll('.product-item').length).toBe(6);
    });

    it('should change order', async () => {
        await wrapper.setProps({ selection: [wrapper.vm.modelValue[2]] });
        await wrapper.setData({ d_selection: [wrapper.vm.modelValue[2]] });

        expect(wrapper.findAll('li.p-listbox-option')[2].classes()).toContain('p-listbox-option-selected');

        await wrapper.vm.moveUp({});

        expect(wrapper.emitted()['update:modelValue'][0][0][1]).toEqual(wrapper.vm.modelValue[2]);
    });

    describe('selection', () => {
        it.each([
            ['without dataKey', undefined],
            ['with dataKey', 'id']
        ])('should show the selected items %s', (_, dataKey) => {
            const value = items(6);
            const wrapper = mountOrderList({ modelValue: value, selection: [value[1], value[4]], dataKey });

            expect(selectedNames(wrapper)).toEqual(['Item #1', 'Item #4']);
        });

        it('should show copies of the items as selected without dataKey', () => {
            const value = items(6);
            const wrapper = mountOrderList({ modelValue: value, selection: [{ ...value[1] }, { ...value[4] }] });

            expect(selectedNames(wrapper)).toEqual(['Item #1', 'Item #4']);
        });

        it('should match copies by dataKey only', () => {
            const value = items(6);
            const wrapper = mountOrderList({ modelValue: value, selection: [{ id: 1, name: 'Renamed' }, { id: 4 }], dataKey: 'id' });

            expect(selectedNames(wrapper)).toEqual(['Item #1', 'Item #4']);
        });

        it('should not match a copy that differs in a field without dataKey', () => {
            const value = items(6);
            const wrapper = mountOrderList({ modelValue: value, selection: [{ ...value[1], price: 0 }] });

            expect(selectedNames(wrapper)).toEqual([]);
        });

        it('should select and unselect the clicked item without dataKey', async () => {
            const value = items(6);
            const wrapper = mountOrderList({ modelValue: value, selection: [value[0]] });

            await wrapper.findAll('li.p-listbox-option')[3].trigger('click');

            expect(lastEmitted(wrapper, 'update:selection')).toEqual([value[0], value[3]]);
            expect(toRaw(lastEmitted(wrapper, 'update:selection')[1])).toBe(value[3]);
            expect(selectedNames(wrapper)).toEqual(['Item #0', 'Item #3']);

            await wrapper.findAll('li.p-listbox-option')[0].trigger('click');

            expect(lastEmitted(wrapper, 'update:selection')).toEqual([value[3]]);
            expect(selectedNames(wrapper)).toEqual(['Item #3']);
        });

        it('should pick up items pushed into the selection array in place', async () => {
            const value = reactive(items(6));
            const selection = reactive([value[1]]);
            const wrapper = mountOrderList({ modelValue: value, selection });

            selection.push(value[5]);
            await nextTick();

            expect(selectedNames(wrapper)).toEqual(['Item #1', 'Item #5']);
        });

        it('should not deep-compare every item with the whole selection without dataKey', async () => {
            // Guards #730: without dataKey every unselected row was deep-compared with every selected item on each render.
            const value = items(40);
            const wrapper = mountOrderList({ modelValue: value, selection: value.filter((item) => item.id % 2 === 0) });
            const isEquals = vi.spyOn(wrapper.findComponent(Listbox).vm, 'isEquals');

            await wrapper.findAll('li.p-listbox-option')[1].trigger('click');
            await move(wrapper, 'movedownicon');

            expect(selectedNames(wrapper)).toHaveLength(21);
            expect(isEquals).not.toHaveBeenCalled();
        });
    });

    describe('reorder', () => {
        it.each([
            ['without dataKey', undefined],
            ['with dataKey', 'id']
        ])('should keep the selection on the moved items %s', async (_, dataKey) => {
            const value = items(6);
            const wrapper = mountOrderList({ modelValue: value, selection: [value[2], value[4]], dataKey });

            await move(wrapper, 'moveupicon');
            expect(renderedNames(wrapper)).toEqual(['Item #0', 'Item #2', 'Item #1', 'Item #4', 'Item #3', 'Item #5']);
            expect(selectedNames(wrapper)).toEqual(['Item #2', 'Item #4']);

            await move(wrapper, 'movedownicon');
            expect(renderedNames(wrapper)).toEqual(['Item #0', 'Item #1', 'Item #2', 'Item #3', 'Item #4', 'Item #5']);
            expect(selectedNames(wrapper)).toEqual(['Item #2', 'Item #4']);

            await move(wrapper, 'movetopicon');
            expect(renderedNames(wrapper)).toEqual(['Item #4', 'Item #2', 'Item #0', 'Item #1', 'Item #3', 'Item #5']);
            expect(selectedNames(wrapper)).toEqual(['Item #4', 'Item #2']);

            await move(wrapper, 'movebottomicon');
            expect(renderedNames(wrapper)).toEqual(['Item #0', 'Item #1', 'Item #3', 'Item #5', 'Item #4', 'Item #2']);
            expect(selectedNames(wrapper)).toEqual(['Item #4', 'Item #2']);

            // The moved items are the same objects, never copies.
            expect(toRaw(lastEmitted(wrapper, 'update:modelValue').at(-1))).toBe(value[2]);
        });

        it('should keep the selection when the items are reordered in place', async () => {
            const value = reactive(items(4));
            const wrapper = mountOrderList({ modelValue: value, selection: [value[0]] });

            value.push(value.shift());
            await nextTick();

            expect(renderedNames(wrapper)).toEqual(['Item #1', 'Item #2', 'Item #3', 'Item #0']);
            expect(selectedNames(wrapper)).toEqual(['Item #0']);
        });
    });
});
