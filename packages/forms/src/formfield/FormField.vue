<template>
    <component v-if="!asChild" :is="as" :class="cx('root')" v-bind="ptmi('root')">
        <slot :props="field.props" v-bind="fieldAttrs"></slot>
    </component>
    <slot v-else :class="cx('root')" :props="field.props" v-bind="fieldAttrs"></slot>
</template>

<script>
import { nextTick } from 'vue';
import BaseFormField from './BaseFormField.vue';

export default {
    name: 'FormField',
    extends: BaseFormField,
    inheritAttrs: false,
    inject: {
        $pcForm: {
            default: undefined
        }
    },
    watch: {
        name(newName, oldName) {
            if (!oldName || oldName === newName) return;

            this.$pcForm?.renameField?.(oldName, newName, this.formControl);
            nextTick(() => {
                this._fieldInst = this.$pcForm?.fields?.[newName] ?? null;
            });
        },
        formControl: {
            immediate: true,
            handler(newValue, oldValue) {
                if (oldValue && newValue?.name !== oldValue?.name) return;

                this.$pcForm?.register?.(this.name, newValue);
                this._fieldInst = this.$pcForm?.fields?.[this.name] ?? null;
            }
        }
    },
    beforeUnmount() {
        const name = this.name;
        const form = this.$pcForm;
        // Prefer the live entry — InputText may have re-registered and replaced _fieldInst.
        const field = form?.fields?.[name] ?? this._fieldInst;

        nextTick(() => {
            if (field && form?.fields?.[name] === field) {
                form.unregister?.(name);
            }
        });
    },
    computed: {
        formControl() {
            return {
                name: this.name,
                resolver: this.resolver,
                initialValue: this.initialValue,
                validateOnValueUpdate: this.validateOnValueUpdate,
                validateOnBlur: this.validateOnBlur,
                validateOnMount: this.validateOnMount,
                validateOnSubmit: this.validateOnSubmit
            };
        },
        field() {
            return this.$pcForm?.fields?.[this.name] || {};
        },
        fieldAttrs() {
            return {
                ...this.field.props,
                ...this.field.states
            };
        }
    }
};
</script>
