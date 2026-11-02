import { mount } from '@vue/test-utils';
import RadioButton from './RadioButton.vue';
import RadioButtonStyle from './style/RadioButtonStyle';

describe('RadioButton.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(RadioButton, {
            props: {
                value: 'Tatooine',
                modelValue: null
            }
        });
    });

    it('should exist', () => {
        expect(wrapper.find('.p-radiobutton.p-component').exists()).toBe(true);
        expect(wrapper.find('input').attributes().type).toBe('radio');
    });

    it('When disabled true and onChange triggered click emit should not be called', async () => {
        await wrapper.setProps({ disabled: true });
        await wrapper.trigger('change');

        expect(wrapper.emitted()['change']).toBeFalsy();
    });

    it('When disabled false and onChange triggered click emit should be called', async () => {
        await wrapper.vm.onChange({});

        expect(wrapper.emitted()['update:modelValue'].length).toEqual(1);
        expect(wrapper.emitted().change.length).toEqual(1);
    });

    it('When value and modelValue equal and onClick triggered change emit should not be called', async () => {
        await wrapper.setProps({ modelValue: 'test', value: 'test' });
        await wrapper.vm.onChange({});

        expect(wrapper.emitted()['change'][0][0]).toEqual({});
    });

    it('When modelValue changed, Checked should be effected', async () => {
        await wrapper.setProps({ modelValue: 'Tatooine' });

        expect(wrapper.vm.checked).toBe(true);
        expect(wrapper.find('.p-radiobutton').classes()).toContain('p-radiobutton-checked');
    });

    it('When component focused onFocus method should be called', async () => {
        await wrapper.setProps({ inputId: 'test' });

        const spy = vi.spyOn(wrapper.vm, 'onFocus');

        await wrapper.find('#test').trigger('focus');

        expect(spy).toHaveBeenCalled();
    });

    it('When component blur onBlur method should be called', async () => {
        await wrapper.setProps({ inputId: 'test' });

        const blurSpy = vi.spyOn(wrapper.vm, 'onBlur');

        await wrapper.find('#test').trigger('blur');

        expect(blurSpy).toHaveBeenCalled();
    });

    it('When onBlur method triggered, false should be false', async () => {
        await wrapper.vm.onBlur();

        expect(wrapper.vm.focus).toBeFalsy();
        expect(wrapper.emitted().blur.length).toEqual(1);
    });

    it('draws the dot in a layer covering the whole ring', () => {
        expect(RadioButtonStyle.style).toMatch(/\.p-radiobutton-icon \{\s*position: absolute;\s*inset: 0;\s*margin: auto;\s*width: auto;\s*height: auto;/);
        expect(RadioButtonStyle.style).toContain('mask-image: radial-gradient(circle closest-side, #000 calc(0.5em - 0.5px), transparent calc(0.5em + 0.5px))');
    });

    it('resets the dot size with the selectors the base style sizes it with', () => {
        const sizing = [...RadioButtonStyle.style.matchAll(/([^{}]+)\{[^}]*\bwidth:/g)].map((match) => match[1].trim()).filter((selector) => selector.includes('p-radiobutton-icon'));

        expect(sizing).toEqual(['.p-radiobutton-icon', '.p-radiobutton-sm .p-radiobutton-icon', '.p-radiobutton-lg .p-radiobutton-icon', '.p-radiobutton-icon', '.p-radiobutton-sm .p-radiobutton-icon,\n    .p-radiobutton-lg .p-radiobutton-icon']);
    });
});
