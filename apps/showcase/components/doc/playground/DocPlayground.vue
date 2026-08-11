<template>
    <div class="doc-main">
        <div class="doc-intro">
            <h1>{{ schema.component }} Playground</h1>
            <p>Change the properties on the right and the component updates as you go. The code underneath is generated from the same state, so it is exactly what you would write by hand.</p>
        </div>

        <!-- the surface is a fixed height so revealing a dependent control scrolls the rail instead of growing the block -->
        <div :class="['card playground-surface', maximized ? 'fixed inset-0 z-[900] m-0 rounded-none' : 'relative']">
            <div :class="['flex flex-col lg:flex-row', maximized ? 'h-full' : 'lg:h-[60rem]']">
                <div class="relative flex min-h-72 min-w-0 flex-1 items-center justify-center overflow-auto p-4">
                    <slot name="preview" :props="props" />

                    <Button
                        :icon="maximized ? 'pi pi-window-minimize' : 'pi pi-window-maximize'"
                        :aria-label="maximized ? 'Exit full screen' : 'View full screen'"
                        v-tooltip.left="{ value: maximized ? 'Exit full screen (Esc)' : 'View full screen', class: 'doc-section-code-tooltip' }"
                        severity="secondary"
                        text
                        rounded
                        class="absolute right-2 top-2"
                        @click="maximized = !maximized"
                    />
                </div>

                <PlaygroundControls :schema="schema" :state="state" :idPrefix="idPrefix" :wide="maximized" @reset="reset" />
            </div>
        </div>

        <h2 class="doc-section-label">Generated code</h2>
        <div class="doc-section-description">
            <p>
                Only the properties you changed appear here, so the snippet stays as short as the equivalent hand-written one. Switch between the Composition and Options API with the buttons, copy it with the copy button, or open it in StackBlitz to
                run it straight away.
            </p>
        </div>

        <DocSectionCode :code="code" :component="schema.component" fullCode />
    </div>
</template>

<script>
import { buildCode } from './codegen';
import PlaygroundControls from './PlaygroundControls.vue';
import { activeProps, createState } from './schema';

export default {
    name: 'DocPlayground',
    components: {
        PlaygroundControls
    },
    props: {
        schema: {
            type: Object,
            required: true
        }
    },
    /*
     * `update:props` is for a component whose model shape depends on a prop; `reset` lets it clear
     * the value it owns, which the control state knows nothing about.
     */
    emits: ['update:props', 'reset'],
    data() {
        return {
            state: createState(this.schema),
            maximized: false
        };
    },
    watch: {
        props: {
            handler(value) {
                this.$emit('update:props', value);
            },
            immediate: true
        },
        /*
         * Maximizing covers the page with a fixed pane rather than asking for real full screen: the
         * suggestions overlay renders into document.body, which a fullscreen element would not show.
         * The page behind it must not scroll while it is covered.
         */
        maximized(value) {
            document.body.style.overflow = value ? 'hidden' : '';
            document.body.classList.toggle('playground-maximized', value);
        }
    },
    computed: {
        idPrefix() {
            return `pg-${this.schema.component.toLowerCase()}`;
        },
        /* The very object bound onto the preview is the one codegen serializes, so the two cannot drift. */
        props() {
            return activeProps(this.schema, this.state);
        },
        code() {
            return buildCode({ schema: this.schema, props: this.props });
        }
    },
    mounted() {
        document.addEventListener('keydown', this.onKeydown);
    },
    beforeUnmount() {
        document.removeEventListener('keydown', this.onKeydown);
        document.body.style.overflow = '';
        document.body.classList.remove('playground-maximized');
    },
    methods: {
        onKeydown(event) {
            // the overlay swallows Escape to close itself first, which is why this only ever sees the second press
            if (event.key === 'Escape' && this.maximized) this.maximized = false;
        },
        reset() {
            this.state = createState(this.schema);
            this.$emit('reset');
        }
    }
};
</script>

<style scoped>
/* the controls rail runs to the edge of the surface, so the padding belongs to the panes instead */
.playground-surface {
    padding: 0;
    overflow: hidden;
}
</style>

<style>
/*
 * The topbar and news bar are fixed at z-index 1100, above the 1000 the suggestions overlay is
 * given. Hiding them clears the maximized surface without raising it over the overlay, which is
 * what covering them by z-index alone would cost.
 */
body.playground-maximized .layout-topbar,
body.playground-maximized .layout-news {
    display: none;
}
</style>
