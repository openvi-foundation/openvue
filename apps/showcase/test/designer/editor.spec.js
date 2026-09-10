// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, reactive } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Aura from '@openvue/themes/aura';
import AppDesigner from '../../components/layout/AppDesigner.vue';
import DesignTokenField from '../../components/layout/designer/editor/DesignTokenField.vue';
import DesignComponentSection from '../../components/layout/designer/editor/component/DesignComponentSection.vue';
import DesignSemanticSection from '../../components/layout/designer/editor/semantic/DesignSemanticSection.vue';
import DesignCustomTokens from '../../components/layout/designer/editor/custom/DesignCustomTokens.vue';
import { createDocument } from '../../service/designer/document';
import { createHistory } from '../../service/designer/history';
import { getPath } from '../../service/designer/path';
import * as storage from '../../service/designer/storage';

const AutoComplete = defineComponent({
    props: ['modelValue'],
    emits: ['input', 'focus', 'blur'],
    template: '<input :value="modelValue" @input="$emit(\'input\', $event)" @focus="$emit(\'focus\', $event)" @blur="$emit(\'blur\', $event)" />'
});

function setup() {
    const appState = reactive({ designer: { theme: createDocument({ name: 'Editor', base: 'Aura', preset: Aura }), acTokens: [] } });
    const ctx = { $appState: appState, history: createHistory(), syncHistoryState: vi.fn(), applyTheme: vi.fn() };
    const service = { recordEdit: AppDesigner.methods.recordEdit.bind(ctx), refreshACTokens: vi.fn(), saveTheme: vi.fn() };
    const toast = { add: vi.fn() };
    const global = {
        mocks: { $appState: appState, $toast: toast },
        provide: { designerService: service },
        components: { AutoComplete, DesignTokenField, DesignComponentSection, DesignSemanticSection },
        directives: { tooltip: {} }
    };

    return { appState, ctx, service, toast, global };
}

describe('editor integration', () => {
    it.each([
        [DesignComponentSection, { componentKey: 'button', path: 'root' }, 'components.button.root.borderRadius'],
        [DesignSemanticSection, { path: 'focusRing' }, 'semantic.focusRing.width'],
        [DesignSemanticSection, { path: 'colorScheme.dark.primary' }, 'semantic.colorScheme.dark.primary.color']
    ])('undoes and redoes a field in its owning token collection', async (component, props, path) => {
        const state = setup();
        const wrapper = mount(component, { props, global: state.global });
        const input = wrapper.find('input');
        const before = getPath(state.appState.designer.theme.preset, path);

        await input.trigger('focus');
        await input.setValue('99px');
        await input.trigger('blur');
        expect(getPath(state.appState.designer.theme.preset, path)).toBe('99px');
        AppDesigner.methods.undo.call(state.ctx);
        await nextTick();
        expect(input.element.value).toBe(before);
        AppDesigner.methods.redo.call(state.ctx);
        await nextTick();
        expect(input.element.value).toBe('99px');
        expect(state.appState.designer.theme.preset).not.toHaveProperty('root');
        wrapper.unmount();
    });

    it('does not record focus without an edit', async () => {
        const state = setup();
        const wrapper = mount(DesignSemanticSection, { props: { path: 'focusRing' }, global: state.global });

        await wrapper.find('input').trigger('focus');
        await wrapper.find('input').trigger('blur');
        expect(state.ctx.history.canUndo()).toBe(false);
        wrapper.unmount();
    });

    it('keeps saved custom tokens when a newly added row is blank', async () => {
        const state = setup();

        state.appState.designer.theme.preset.extend = { accent: { color: '#123456' } };
        const wrapper = mount(DesignCustomTokens, { global: state.global });

        await wrapper
            .findAll('button')
            .find((button) => button.text() === 'Add New')
            .trigger('click');
        await wrapper
            .findAll('button')
            .find((button) => button.text() === 'Save')
            .trigger('click');
        expect(state.appState.designer.theme.preset.extend).toEqual({ accent: { color: '#123456' } });
        expect(state.service.saveTheme).not.toHaveBeenCalled();
        expect(state.toast.add).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
        wrapper.unmount();
    });

    afterEach(() => {
        window.localStorage.clear();
        storage.resetForTests();
        window.location.hash = '';
    });

    it('persists a theme restored from a share link', async () => {
        const ctx = { $appState: reactive({ designer: { theme: null, themes: [], acTokens: [], activeView: 'dashboard', active: false } }), $toast: { add: vi.fn() }, applyFont: vi.fn(), refreshACTokens: vi.fn() };

        for (const name of ['restoreFromHash', 'createShareLink', 'toPlainDocument', 'getBasePreset', 'persist', 'listThemes', 'activateTheme']) {
            ctx[name] = AppDesigner.methods[name].bind(ctx);
        }

        ctx.$appState.designer.theme = createDocument({ name: 'Shared', base: 'Aura', preset: Aura });
        ctx.$appState.designer.theme.preset.components.button.root.borderRadius = '13px';
        window.location.hash = new URL(await ctx.createShareLink()).hash;

        expect(await ctx.restoreFromHash()).toBe(true);

        // The fragment is gone by now, so storage is the only remaining copy.
        const restored = storage.loadTheme(storage.getActiveId());

        expect(window.location.hash).toBe('');
        expect(restored).not.toBeNull();
        expect(getPath(restored.preset, 'components.button.root.borderRadius')).toBe('13px');
        expect(ctx.$appState.designer.themes.map((theme) => theme.id)).toEqual([restored.id]);
    });
});
