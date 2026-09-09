<template>
    <div class="leading-6 text-muted-color mb-4">
        Extend the theming system with your own design tokens e.g. <span class="font-medium">accent.color</span>. Do not use curly braces in the name field, and ensure that the name does not match any built-in tokens.
    </div>
    <ul v-if="tokens?.length" class="flex flex-col gap-4 list-none p-0 mx-0 mb-4">
        <li v-for="(token, index) of tokens" :key="index" class="first:border-t border-b border-surface-200 dark:border-surface-700 py-2">
            <div class="flex items-center gap-4">
                <label class="flex items-center gap-2 flex-auto">
                    <span class="text-sm">Name</span>
                    <input v-model="token['name']" type="text" class="border border-surface-300 dark:border-surface-600 rounded-lg py-2 px-2 w-full" placeholder="custom.token.name" maxlength="100" />
                </label>
                <label class="flex items-center gap-2 flex-auto">
                    <span class="text-sm">Value</span>
                    <input v-model="token['value']" type="text" class="border border-surface-300 dark:border-surface-600 rounded-lg py-2 px-2 w-full" placeholder="token value" maxlength="100" />
                </label>
                <button
                    type="button"
                    @click="removeToken(index)"
                    class="cursor-pointer inline-flex items-center justify-center ms-auto w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-400/10 dark:hover:bg-red-400/20 dark:text-red-400 transition-colors duration-200 focus:outline focus:outline-offset-2 focus:outline-red-600 focus:dark:outline-red-400"
                >
                    <i class="pi pi-times" />
                </button>
            </div>
        </li>
    </ul>
    <div class="flex justify-between">
        <button type="button" @click="addToken" class="btn-design-outlined">Add New</button>
        <button type="button" @click="save" class="btn-design">Save</button>
    </div>
</template>

<script>
import { usePreset } from '@openvue/themes';
import { buildCustomTokens } from '@/service/designer/custom';

export default {
    inject: ['designerService'],
    data() {
        return {
            tokens: []
        };
    },
    created() {
        const extend = this.$appState.designer.theme.preset.extend;
        this.tokens = [];

        if (extend) {
            this.tokens = this.objectToDotNotation(extend);
        }
    },
    methods: {
        addToken() {
            this.tokens = [...this.tokens, { name: '', value: '' }];
        },
        removeToken(index) {
            this.tokens.splice(index, 1);
        },
        save() {
            const result = buildCustomTokens(this.tokens);

            if (!result.ok) {
                this.$toast.add({ severity: 'error', summary: 'Invalid custom token', detail: result.message, life: 5000 });

                return;
            }

            this.$appState.designer.theme.preset.extend = result.tokens;

            this.designerService.saveTheme(this.$appState.designer.theme);
            usePreset(this.$appState.designer.theme.preset);
            this.designerService.refreshACTokens();
            this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Tokens saved', life: 3000 });
        },
        objectToDotNotation(obj, prefix = '', result = []) {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const path = prefix ? `${prefix}.${key}` : key;

                    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                        this.objectToDotNotation(obj[key], path, result);
                    } else {
                        result.push({
                            name: path,
                            value: obj[key]
                        });
                    }
                }
            }

            return result;
        }
    }
};
</script>
