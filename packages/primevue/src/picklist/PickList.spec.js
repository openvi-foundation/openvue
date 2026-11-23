import { mount } from '@vue/test-utils';
import Listbox from 'openvue/listbox';
import { nextTick, reactive, toRaw } from 'vue';
import PickList from './PickList.vue';

const items = (count) => Array.from({ length: count }, (_, i) => ({ id: i, name: `Item #${i}`, category: 'Accessories', price: i + 0.99 }));

const mountPickList = (props = {}) =>
    mount(PickList, {
        props: { responsive: false, ...props },
        slots: { option: '<template #option="{ option }">{{ option.name }}</template>' }
    });

const listContainer = (wrapper, listIndex) => wrapper.find(listIndex === 0 ? '.p-picklist-source-list-container' : '.p-picklist-target-list-container');

const renderedNames = (wrapper, listIndex) =>
    listContainer(wrapper, listIndex)
        .findAll('li.p-listbox-option')
        .map((option) => option.text());

const selectedNames = (wrapper, listIndex) =>
    listContainer(wrapper, listIndex)
        .findAll('li.p-listbox-option')
        .filter((option) => option.attributes('aria-selected') === 'true')
        .map((option) => option.text());

const lastEmitted = (wrapper, event) => wrapper.emitted(event).at(-1)[0];

// Hands the new lists back like v-model would.
const applyModelValue = (wrapper) => wrapper.setProps({ modelValue: lastEmitted(wrapper, 'update:modelValue') });

describe('PickList.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(PickList, {
            props: {
                responsive: false,
                modelValue: [
                    [
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
                        }
                    ],
                    []
                ]
            },
            slots: {
                sourceheader: 'Available',
                targetheader: 'Selected'
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.p-picklist.p-component').exists()).toBe(true);
        expect(wrapper.find('.p-picklist-list-container.p-picklist-source-list-container').exists()).toBe(true);
        expect(wrapper.find('.p-picklist-list-container.p-picklist-target-list-container').exists()).toBe(true);
    });

    it('should slots work', () => {
        expect(wrapper.find('.p-picklist-source-list-container .p-listbox-header').text()).toBe('Available');
        expect(wrapper.find('.p-picklist-target-list-container .p-listbox-header').text()).toBe('Selected');
    });

    it('should update sourceList and targetList', async () => {
        await wrapper.setProps({
            modelValue: [
                [
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
                    }
                ],
                [
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
                    }
                ]
            ]
        });

        expect(wrapper.vm.sourceList.length).toBe(1);
        expect(wrapper.vm.targetList.length).toBe(1);
    });

    it('should select an item from source list', async () => {
        const sourceListItem = wrapper.find('.p-picklist-source-list-container .p-listbox-option');

        expect(sourceListItem.classes()).not.toContain('p-listbox-option-selected');

        await sourceListItem.trigger('click');

        expect(sourceListItem.classes()).toContain('p-listbox-option-selected');
        expect(wrapper.emitted()['update:selection'][0][0]).toEqual([[wrapper.vm.modelValue[0][0]], []]);
    });

    it('should dblclick an item from source list', async () => {
        await wrapper.setProps({ selection: [[wrapper.vm.modelValue[0][0]], []] });

        wrapper.vm.onItemDblClick({}, 0);

        expect(wrapper.emitted()['update:modelValue'][0][0][1]).toEqual([wrapper.vm.modelValue[0][0]]);
        expect(wrapper.emitted()['move-to-target'][0]).toEqual([{ originalEvent: {}, items: [wrapper.vm.modelValue[0][0]] }]);
        expect(wrapper.emitted()['update:selection'][0][0]).toEqual([[], []]);
    });

    it('should move item up', async () => {
        await wrapper.setProps({ selection: [[wrapper.vm.modelValue[0][1]], []] });

        await wrapper.vm.moveUp({}, 0);

        expect(wrapper.emitted()['update:modelValue'][0][0]).toEqual([
            [
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
                }
            ],
            []
        ]);
    });

    it('should should move all to target', async () => {
        await wrapper.vm.moveAllToTarget({});

        expect(wrapper.emitted()['update:modelValue'][0][0]).toEqual([
            [],
            [
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
                }
            ]
        ]);
    });

    describe('selection', () => {
        it.each([
            ['without dataKey', undefined],
            ['with dataKey', 'id']
        ])('should show the selected items of both lists %s', (_, dataKey) => {
            const value = items(6);
            const wrapper = mountPickList({ modelValue: [value.slice(0, 4), value.slice(4)], selection: [[value[1], value[3]], [value[5]]], dataKey });

            expect(selectedNames(wrapper, 0)).toEqual(['Item #1', 'Item #3']);
            expect(selectedNames(wrapper, 1)).toEqual(['Item #5']);
        });

        it('should show copies of the items as selected without dataKey', () => {
            const value = items(6);
            const wrapper = mountPickList({ modelValue: [value.slice(0, 4), value.slice(4)], selection: [[{ ...value[2] }], [{ ...value[4] }]] });

            expect(selectedNames(wrapper, 0)).toEqual(['Item #2']);
            expect(selectedNames(wrapper, 1)).toEqual(['Item #4']);
        });

        it('should match copies by dataKey only', () => {
            const value = items(6);
            const wrapper = mountPickList({ modelValue: [value.slice(0, 4), value.slice(4)], selection: [[{ id: 2, name: 'Renamed' }], [{ id: 4 }]], dataKey: 'id' });

            expect(selectedNames(wrapper, 0)).toEqual(['Item #2']);
            expect(selectedNames(wrapper, 1)).toEqual(['Item #4']);
        });

        it('should not match a copy that differs in a field without dataKey', () => {
            const value = items(4);
            const wrapper = mountPickList({ modelValue: [value, []], selection: [[{ ...value[2], price: 0 }], []] });

            expect(selectedNames(wrapper, 0)).toEqual([]);
        });

        it('should show a reassigned selection', async () => {
            const value = items(4);
            const wrapper = mountPickList({ modelValue: [value, []], selection: [[value[0]], []] });

            await wrapper.setProps({ selection: [[value[1], value[2]], []] });

            expect(selectedNames(wrapper, 0)).toEqual(['Item #1', 'Item #2']);
        });

        it('should select the clicked item itself, not a copy', async () => {
            const value = items(4);
            const wrapper = mountPickList({ modelValue: [value, []], selection: [[value[0]], []] });

            await listContainer(wrapper, 0).findAll('li.p-listbox-option')[2].trigger('click');

            expect(lastEmitted(wrapper, 'update:selection')[0]).toEqual([value[0], value[2]]);
            expect(toRaw(lastEmitted(wrapper, 'update:selection')[0][1])).toBe(value[2]);
            expect(selectedNames(wrapper, 0)).toEqual(['Item #0', 'Item #2']);
        });

        it('should not deep-compare every item with the whole selection without dataKey', async () => {
            // Guards #730: without dataKey every unselected row was deep-compared with every selected item on each render.
            const value = items(40);
            const wrapper = mountPickList({ modelValue: [value, []], selection: [value.filter((item) => item.id % 2 === 0), []] });
            const [source, target] = wrapper.findAllComponents(Listbox);
            const isEquals = [vi.spyOn(source.vm, 'isEquals'), vi.spyOn(target.vm, 'isEquals')];

            await listContainer(wrapper, 0).findAll('li.p-listbox-option')[1].trigger('click');
            wrapper.vm.moveToTarget({});
            await applyModelValue(wrapper);
            await listContainer(wrapper, 0).findAll('li.p-listbox-option')[0].trigger('click');

            expect(renderedNames(wrapper, 1)).toHaveLength(21);
            expect(selectedNames(wrapper, 0)).toEqual(['Item #3']);
            isEquals.forEach((spy) => expect(spy).not.toHaveBeenCalled());
        });
    });

    describe('reorder and transfer', () => {
        it.each([
            ['without dataKey', undefined],
            ['with dataKey', 'id']
        ])('should keep the selection on the moved items %s', async (_, dataKey) => {
            const value = items(6);
            const wrapper = mountPickList({ modelValue: [value, []], selection: [[value[2], value[4]], []], dataKey });

            wrapper.vm.moveUp({}, 0);
            await applyModelValue(wrapper);
            expect(renderedNames(wrapper, 0)).toEqual(['Item #0', 'Item #2', 'Item #1', 'Item #4', 'Item #3', 'Item #5']);
            expect(selectedNames(wrapper, 0)).toEqual(['Item #2', 'Item #4']);

            wrapper.vm.moveDown({}, 0);
            await applyModelValue(wrapper);
            expect(renderedNames(wrapper, 0)).toEqual(['Item #0', 'Item #1', 'Item #2', 'Item #3', 'Item #4', 'Item #5']);
            expect(selectedNames(wrapper, 0)).toEqual(['Item #2', 'Item #4']);

            wrapper.vm.moveTop({}, 0);
            await applyModelValue(wrapper);
            expect(renderedNames(wrapper, 0)).toEqual(['Item #4', 'Item #2', 'Item #0', 'Item #1', 'Item #3', 'Item #5']);
            expect(selectedNames(wrapper, 0)).toEqual(['Item #4', 'Item #2']);

            wrapper.vm.moveBottom({}, 0);
            await applyModelValue(wrapper);
            expect(renderedNames(wrapper, 0)).toEqual(['Item #0', 'Item #1', 'Item #3', 'Item #5', 'Item #4', 'Item #2']);
            expect(selectedNames(wrapper, 0)).toEqual(['Item #4', 'Item #2']);
        });

        it.each([
            ['without dataKey', undefined],
            ['with dataKey', 'id']
        ])('should move the selected items between the lists and clear their selection %s', async (_, dataKey) => {
            const value = items(6);
            const wrapper = mountPickList({ modelValue: [value.slice(0, 4), value.slice(4)], selection: [[value[1], value[3]], [value[5]]], dataKey });

            wrapper.vm.moveToTarget({});
            await applyModelValue(wrapper);

            expect(renderedNames(wrapper, 0)).toEqual(['Item #0', 'Item #2']);
            expect(renderedNames(wrapper, 1)).toEqual(['Item #4', 'Item #5', 'Item #1', 'Item #3']);
            expect(selectedNames(wrapper, 0)).toEqual([]);
            expect(selectedNames(wrapper, 1)).toEqual(['Item #5']);
            // The moved items are the same objects, never copies.
            expect(toRaw(lastEmitted(wrapper, 'update:modelValue')[1][2])).toBe(value[1]);

            wrapper.vm.moveToSource({});
            await applyModelValue(wrapper);

            expect(renderedNames(wrapper, 0)).toEqual(['Item #0', 'Item #2', 'Item #5']);
            expect(renderedNames(wrapper, 1)).toEqual(['Item #4', 'Item #1', 'Item #3']);
            expect(selectedNames(wrapper, 0)).toEqual([]);
            expect(selectedNames(wrapper, 1)).toEqual([]);
            expect(lastEmitted(wrapper, 'update:selection')).toEqual([[], []]);
        });

        it('should keep the selection when the items are reordered in place', async () => {
            const value = reactive([items(4), []]);
            const wrapper = mountPickList({ modelValue: value, selection: [[value[0][0]], []] });

            value[0].push(value[0].shift());
            await nextTick();

            expect(renderedNames(wrapper, 0)).toEqual(['Item #1', 'Item #2', 'Item #3', 'Item #0']);
            expect(selectedNames(wrapper, 0)).toEqual(['Item #0']);
        });
    });
});
