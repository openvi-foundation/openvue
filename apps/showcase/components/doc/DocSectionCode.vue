<template>
    <div v-if="!embedded" :class="['doc-section-code', { 'is-collapsible': collapsible, 'is-collapsed': collapsible && !expanded }]">
        <div class="doc-section-code-buttons animate-scalein animate-duration-300">
            <template v-if="codeMode !== 'basic' && !hideToggleCode">
                <button :class="['py-0 px-2 rounded h-2rem', { 'code-active': codeLang === 'composition' }]" @click="codeLang = 'composition'">Composition API</button>
                <button :class="['py-0 px-2 rounded h-2rem', { 'code-active': codeLang === 'options' }]" @click="codeLang = 'options'">Options API</button>
            </template>

            <template v-if="!hideToggleCode">
                <button
                    v-tooltip.bottom="{ value: 'Toggle Full Code', class: 'doc-section-code-tooltip' }"
                    type="button"
                    aria-label="Toggle Full Code"
                    @click="toggleCodeMode('composition')"
                    class="h-8 w-8 p-0 inline-flex items-center justify-center"
                >
                    <i class="pi pi-code"></i>
                </button>
            </template>

            <template v-if="!hideToggleCode && code.data">
                <button v-tooltip.bottom="{ value: 'View Data', class: 'doc-section-code-tooltip' }" type="button" aria-label="View Data" @click="onToggleData" class="h-8 w-8 p-0 inline-flex items-center justify-center">
                    <i class="pi pi-database"></i>
                </button>
            </template>

            <template v-if="!hideStackBlitz">
                <button v-tooltip.bottom="{ value: 'Edit in StackBlitz', class: 'doc-section-code-tooltip' }" type="button" aria-label="Edit in StackBlitz" class="h-8 w-8 p-0 inline-flex items-center justify-center" @click="showStackblitz">
                    <svg role="img" width="13" height="18" viewBox="0 0 13 19" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: 'block'">
                        <path d="M0 10.6533H5.43896L2.26866 18.1733L12.6667 7.463H7.1986L10.3399 0L0 10.6533Z" />
                    </svg>
                </button>
            </template>

            <button v-tooltip.bottom="{ value: 'Copy Code', class: 'doc-section-code-tooltip' }" type="button" aria-label="Copy Code" @click="copyCode" class="h-8 w-8 p-0 inline-flex items-center justify-center">
                <i class="pi pi-copy"></i>
            </button>
        </div>

        <div ref="body" dir="ltr" class="doc-section-code-body">
            <template v-if="codeMode === 'basic' && importCode">
                <pre v-code.script><code>{{ code.basic }}
</code></pre>
            </template>

            <template v-if="codeMode === 'basic' && format === 'css'">
                <pre v-code.css><code>{{ code.basic }}
</code></pre>
            </template>

            <template v-if="codeMode === 'basic' && !importCode && !format">
                <pre v-code><code>{{ code.basic }}
</code></pre>
            </template>

            <template v-if="codeMode !== 'basic' && codeLang === 'options'">
                <pre v-code><code>{{ code.options }}
</code></pre>
            </template>

            <template v-if="codeMode !== 'basic' && codeLang === 'composition'">
                <pre v-code><code>{{ code.composition }}
</code></pre>
            </template>

            <template v-if="codeMode !== 'basic' && codeLang === 'data'">
                <pre v-code.json><code>{{ code.data }}
</code></pre>
            </template>
        </div>

        <button v-if="collapsible" type="button" class="doc-section-code-expand" :aria-expanded="expanded" @click="expanded = !expanded">
            <span>{{ expanded ? 'Collapse code' : 'Show full code' }}</span>
            <i :class="['pi', expanded ? 'pi-chevron-up' : 'pi-chevron-down']" aria-hidden="true"></i>
        </button>
    </div>
    <div v-else id="embed"></div>
</template>

<script>
import { useStackBlitz } from './codeeditor';

export default {
    inheritAttrs: false,
    props: {
        code: {
            type: null,
            default: null
        },
        format: {
            type: String,
            default: null
        },
        service: {
            type: Array,
            default: null
        },
        hideToggleCode: {
            type: Boolean,
            default: false
        },
        hideCodeSandbox: {
            type: Boolean,
            default: true
        },
        hideStackBlitz: {
            type: Boolean,
            default: false
        },
        dependencies: {
            type: null,
            default: null
        },
        component: {
            type: String,
            default: null
        },
        extFiles: {
            type: null,
            default: null
        },
        importCode: {
            type: Boolean,
            default: false
        },
        embedded: {
            type: Boolean,
            default: false
        },
        scrollable: {
            type: Boolean,
            default: false
        },
        fullCode: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            codeMode: this.fullCode && this.code?.['composition'] ? 'composition' : 'basic',
            codeLang: this.code['options'] ? 'composition' : 'basic',
            collapsible: false,
            expanded: false
        };
    },
    watch: {
        codeMode() {
            this.measure();
        },
        codeLang() {
            this.measure();
        }
    },
    mounted() {
        this.measure();

        this.embedded && useStackBlitz(this.codeLang, this.code['composition'], this.service, this.code.pages, this.dependencies, this.component, this.extFiles, this.embedded);
    },
    methods: {
        /* Long snippets start folded to a few lines, so a page reads as a column of live demos
           instead of a wall of code. Short ones are never folded. */
        measure() {
            this.$nextTick(() => {
                const pre = this.$refs.body?.querySelector('pre');

                this.expanded = false;
                this.collapsible = !!pre && pre.scrollHeight > 320;
            });
        },
        toggleCodeMode(content) {
            this.codeMode = this.codeMode === 'basic' ? content : 'basic';
        },
        onToggleData() {
            this.toggleCodeMode('data');
            this.codeLang = 'data';
        },
        async copyCode() {
            await navigator.clipboard.writeText(this.code[this.codeLang]);
        },
        showStackblitz() {
            useStackBlitz(this.codeLang, this.code[this.codeLang === 'data' ? 'options' : this.codeLang], this.service, this.code.pages, this.dependencies, this.component, this.extFiles);
        }
    }
};
</script>
