import { flushPromises, mount } from '@vue/test-utils';
import PrimeVue from 'openvue/config';
import { h } from 'vue';
import Select from './Select.vue';

describe('Select.vue', () => {
    let wrapper;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            }
        });

        await wrapper.trigger('click');
    });

    it('should Select exist', () => {
        expect(wrapper.find('.p-select.p-component').exists()).toBe(true);
        expect(wrapper.find('.p-select-overlay').exists()).toBe(true);
        expect(wrapper.find('.p-select-empty-message').exists()).toBe(true);
        expect(wrapper.find('.p-inputwrapper-filled').exists()).toBe(false);
        expect(wrapper.find('.p-inputwrapper-focus').exists()).toBe(true);
    });
});

describe('option checks', () => {
    let wrapper;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                options: [
                    { name: 'New York', code: 'NY' },
                    { name: 'Rome', code: 'RM' },
                    { name: 'London', code: 'LDN' },
                    { name: 'Istanbul', code: 'IST' },
                    { name: 'Paris', code: 'PRS' }
                ],
                optionLabel: 'name',
                optionValue: 'code',
                placeholder: 'Select a City'
            }
        });

        await wrapper.trigger('click');
    });

    it('should show the options', () => {
        expect(wrapper.find('.p-select-label.p-placeholder').text()).toBe('Select a City');
        expect(wrapper.find('.p-select-list-container > .p-select-list').exists()).toBe(true);
        expect(wrapper.find('.p-select-option').exists()).toBe(true);
        expect(wrapper.findAll('.p-select-option').length).toBe(5);
        expect(wrapper.findAll('.p-select-option')[0].text()).toBe('New York');
    });
});

describe('clear checks', () => {
    let wrapper;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                clearIcon: 'pi pi-discord',
                modelValue: { name: 'New York', code: 'NY' },
                showClear: true,
                options: [
                    { name: 'New York', code: 'NY' },
                    { name: 'Rome', code: 'RM' },
                    { name: 'London', code: 'LDN' },
                    { name: 'Istanbul', code: 'IST' },
                    { name: 'Paris', code: 'PRS' }
                ]
            }
        });

        await wrapper.trigger('click');
    });

    it('should have correct icon', () => {
        expect(wrapper.find('.p-select-clear-icon i').classes()).toContain('pi-discord');
    });

    it('should render the clear icon as a labelled button', () => {
        const clearButton = wrapper.find('.p-select-clear-icon');

        expect(clearButton.element.tagName).toBe('BUTTON');
        expect(clearButton.attributes('type')).toBe('button');
        expect(clearButton.attributes('aria-label')).toBe('Clear');
        expect(clearButton.find('i').attributes('aria-hidden')).toBe('true');
    });

    it('should clear the value when the clear button is clicked', async () => {
        await wrapper.find('.p-select-clear-icon').trigger('click');

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([null]);
    });
});

describe('editable checks', () => {
    let wrapper;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                options: [
                    { name: 'New York', code: 'NY' },
                    { name: 'Rome', code: 'RM' },
                    { name: 'London', code: 'LDN' },
                    { name: 'Istanbul', code: 'IST' },
                    { name: 'Paris', code: 'PRS' }
                ],
                optionLabel: 'name',
                optionValue: 'code',
                placeholder: 'Select a City',
                editable: true
            }
        });

        await wrapper.trigger('click');
    });

    it('should show the options', () => {
        expect(wrapper.find('.p-select-label.p-placeholder').exists()).toBe(false);
        expect(wrapper.find('.p-select-label[type="text"]').exists()).toBe(true);
    });
});

describe('option groups checks', () => {
    let wrapper;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                options: [
                    {
                        label: 'Germany',
                        code: 'DE',
                        items: [
                            { label: 'Berlin', value: 'Berlin' },
                            { label: 'Frankfurt', value: 'Frankfurt' },
                            { label: 'Hamburg', value: 'Hamburg' },
                            { label: 'Munich', value: 'Munich' }
                        ]
                    },
                    {
                        label: 'USA',
                        code: 'US',
                        items: [
                            { label: 'Chicago', value: 'Chicago' },
                            { label: 'Los Angeles', value: 'Los Angeles' },
                            { label: 'New York', value: 'New York' },
                            { label: 'San Francisco', value: 'San Francisco' }
                        ]
                    },
                    {
                        label: 'Japan',
                        code: 'JP',
                        items: [
                            { label: 'Kyoto', value: 'Kyoto' },
                            { label: 'Osaka', value: 'Osaka' },
                            { label: 'Tokyo', value: 'Tokyo' },
                            { label: 'Yokohama', value: 'Yokohama' }
                        ]
                    }
                ],
                optionLabel: 'label',
                optionGroupLabel: 'label',
                optionGroupChildren: 'items'
            }
        });

        await wrapper.trigger('click');
    });

    it('should show the option groups', () => {
        expect(wrapper.findAll('.p-select-option-group').length).toBe(3);
        expect(wrapper.findAll('.p-select-option-group')[0].text()).toBe('Germany');
    });
});

describe('templating checks', () => {
    let wrapper;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            slots: {
                header: h('span', { class: 'header-slot' }, 'Header slot'),
                footer: h('span', { class: 'footer-slot' }, 'Footer slot'),
                option: h('span', { class: 'option-slot' }, 'Option slot'),
                optiongroup: h('span', { class: 'optiongroup-slot' }, 'OptionGroup slot'),
                emptyfilter: h('span', { class: 'emptyfilter-slot' }, 'Empty filter slot')
            },
            props: {
                options: [
                    {
                        label: 'Germany',
                        code: 'DE',
                        items: [
                            { label: 'Berlin', value: 'Berlin' },
                            { label: 'Frankfurt', value: 'Frankfurt' },
                            { label: 'Hamburg', value: 'Hamburg' },
                            { label: 'Munich', value: 'Munich' }
                        ]
                    }
                ],
                optionLabel: 'label',
                optionGroupLabel: 'label',
                optionGroupChildren: 'items'
            }
        });

        await wrapper.trigger('click');
    });

    it('should see header and footer slots', () => {
        expect(wrapper.find('.header-slot').exists()).toBe(true);
        expect(wrapper.find('.header-slot').text()).toBe('Header slot');
        expect(wrapper.find('.footer-slot').exists()).toBe(true);
        expect(wrapper.find('.footer-slot').text()).toBe('Footer slot');
        expect(wrapper.find('.option-slot').exists()).toBe(true);
        expect(wrapper.find('.option-slot').text()).toBe('Option slot');
        expect(wrapper.find('.optiongroup-slot').exists()).toBe(true);
        expect(wrapper.find('.optiongroup-slot').text()).toBe('OptionGroup slot');
    });
});

describe('empty templating checks', () => {
    let wrapper;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                options: [],
                optionLabel: 'label',
                optionGroupLabel: 'label',
                optionGroupChildren: 'items',
                emptyMessage: 'Need options prop',
                filterValue: 'xd'
            }
        });

        await wrapper.trigger('click');
    });

    it('should see empty slots', () => {
        expect(wrapper.find('.p-select-empty-message').exists()).toBe(true);
        expect(wrapper.find('.p-select-empty-message').text()).toBe('Need options prop');
    });
});

describe('loader checks', () => {
    let wrapper;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                loading: true,
                loadingIcon: 'pi pi-discord',
                options: [
                    { name: 'New York', code: 'NY' },
                    { name: 'Rome', code: 'RM' },
                    { name: 'London', code: 'LDN' },
                    { name: 'Istanbul', code: 'IST' },
                    { name: 'Paris', code: 'PRS' }
                ],
                optionLabel: 'name',
                optionValue: 'code',
                placeholder: 'Select a City'
            }
        });

        await wrapper.trigger('click');
    });

    it('should show the loader', async () => {
        expect(wrapper.find('.p-select-loading-icon').classes()).toContain('pi-discord');

        await wrapper.setProps({ loading: false });

        expect(wrapper.find('.p-select-loading-icon').exists()).toBe(false);
    });
});

describe('filter checks', () => {
    let wrapper;

    beforeEach(async () => {
        wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: {
                filter: true,
                filterIcon: 'pi pi-discord',
                options: [
                    { name: 'Australia', code: 'AU' },
                    { name: 'Brazil', code: 'BR' },
                    { name: 'China', code: 'CN' },
                    { name: 'Egypt', code: 'EG' },
                    { name: 'France', code: 'FR' },
                    { name: 'Germany', code: 'DE' },
                    { name: 'India', code: 'IN' },
                    { name: 'Japan', code: 'JP' },
                    { name: 'Spain', code: 'ES' },
                    { name: 'United States', code: 'US' }
                ],
                optionLabel: 'name'
            }
        });

        await wrapper.trigger('click');
    });

    it('should make filtering', async () => {
        const filterInput = wrapper.find('.p-select-filter');
        const filterIcon = wrapper.find('[data-pc-section="filtericon"]');

        expect(filterInput.exists()).toBe(true);
        expect(filterIcon.classes()).toContain('pi-discord');

        const event = { target: { value: 'c' } };
        const onFilterChange = vi.spyOn(wrapper.vm, 'onFilterChange');

        wrapper.vm.onFilterChange(event);
        await wrapper.vm.$nextTick();

        expect(onFilterChange).toHaveBeenCalled();

        await wrapper.setData({ filterValue: 'c' });

        expect(wrapper.findAll('.p-select-option').length).toBe(2);
    });
});

describe('label checks', () => {
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' }
    ];
    let label;
    let wrapper;

    const mountSelect = async (props) => {
        wrapper = mount(Select, {
            attachTo: document.body,
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: { options: cities, optionLabel: 'name', placeholder: 'Select a City', ...props }
        });

        await wrapper.vm.$nextTick();
    };

    beforeEach(() => {
        label = document.createElement('label');
        label.htmlFor = 'city';
        label.textContent = 'City';
        document.body.appendChild(label);
    });

    afterEach(() => {
        wrapper?.unmount();
        label.remove();
    });

    it('should be labelled by a label whose for matches labelId', async () => {
        await mountSelect({ labelId: 'city' });

        expect(label.id).toBeTruthy();
        expect(wrapper.find('.p-select-label').attributes('aria-labelledby')).toBe(label.id);
    });

    it('should be labelled by a label whose for matches the deprecated inputId', async () => {
        await mountSelect({ inputId: 'city' });

        expect(wrapper.find('.p-select-label').attributes('aria-labelledby')).toBe(label.id);
    });

    it('should keep the existing id of the label', async () => {
        label.id = 'city-label';
        await mountSelect({ labelId: 'city' });

        expect(label.id).toBe('city-label');
        expect(wrapper.find('.p-select-label').attributes('aria-labelledby')).toBe('city-label');
    });

    it('should focus when the label is clicked', async () => {
        await mountSelect({ inputId: 'city' });

        label.click();

        expect(document.activeElement).toBe(wrapper.find('.p-select-label').element);
    });

    it('should prefer ariaLabelledby and ariaLabel over the label', async () => {
        await mountSelect({ labelId: 'city', ariaLabelledby: 'other-label' });

        expect(wrapper.find('.p-select-label').attributes('aria-labelledby')).toBe('other-label');
        wrapper.unmount();

        await mountSelect({ labelId: 'city', ariaLabel: 'Destination' });

        expect(wrapper.find('.p-select-label').attributes('aria-labelledby')).toBeUndefined();
        expect(wrapper.find('.p-select-label').attributes('aria-label')).toBe('Destination');
        expect(label.hasAttribute('id')).toBe(false);
    });

    it('should follow a labelId that changes after mount', async () => {
        await mountSelect({ labelId: 'other' });

        expect(wrapper.find('.p-select-label').attributes('aria-labelledby')).toBeUndefined();

        await wrapper.setProps({ labelId: 'city' });
        await flushPromises();

        expect(wrapper.find('.p-select-label').attributes('aria-labelledby')).toBe(label.id);
    });

    it('should remove the generated label id on unmount', async () => {
        await mountSelect({ labelId: 'city' });
        wrapper.unmount();
        wrapper = null;

        expect(label.hasAttribute('id')).toBe(false);
    });

    it('should leave the label to the native input when editable', async () => {
        await mountSelect({ labelId: 'city', editable: true });

        expect(wrapper.find('input.p-select-label').attributes('aria-labelledby')).toBeUndefined();
        expect(label.hasAttribute('id')).toBe(false);
    });
});

describe('aria attribute checks', () => {
    it.each([false, true])('should pass aria-describedby and aria-required to the combobox when editable is %s', (editable) => {
        const wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            props: { editable, ariaDescribedby: 'city-help', ariaRequired: true }
        });
        const combobox = wrapper.find('[role="combobox"]');

        expect(combobox.attributes('aria-describedby')).toBe('city-help');
        expect(combobox.attributes('aria-required')).toBe('true');
        expect(wrapper.find('.p-select').attributes('aria-describedby')).toBeUndefined();
    });

    it('should accept aria-describedby and aria-required written as attributes', () => {
        const wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            },
            attrs: { 'aria-describedby': 'city-help', 'aria-required': 'true' }
        });
        const combobox = wrapper.find('[role="combobox"]');

        expect(combobox.attributes('aria-describedby')).toBe('city-help');
        expect(combobox.attributes('aria-required')).toBe('true');
    });

    it('should not render aria-required by default', () => {
        const wrapper = mount(Select, {
            global: {
                plugins: [PrimeVue],
                stubs: {
                    teleport: true
                }
            }
        });

        expect(wrapper.find('[role="combobox"]').attributes('aria-required')).toBeUndefined();
    });
});
