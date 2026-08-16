<template>
    <div class="doc-main">
        <div class="doc-intro">
            <h1>{{ schema.component }} Playground</h1>
            <p>Change the properties on the right and the component updates as you go. The code underneath is generated from the same state, so it is exactly what you would write by hand.</p>
        </div>

        <!-- the surface is a fixed height so revealing a dependent control scrolls the rail instead of growing the block -->
        <div :class="['card playground-surface', maximized ? 'fixed inset-0 z-[900] m-0 rounded-none' : 'relative']">
            <div :class="['flex flex-col lg:flex-row', maximized ? 'h-full' : 'lg:h-[60rem]']">
                <!-- the dotted canvas sits behind the component so a white or transparent one still reads as an object on a surface -->
                <div class="playground-canvas relative flex min-h-72 min-w-0 flex-1 items-center justify-center overflow-auto p-4">
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

                <PlaygroundControls :schema="schema" :state="state" :idPrefix="idPrefix" @reset="reset" />
            </div>
        </div>

        <h2 class="doc-section-label">Generated code</h2>
        <div class="doc-section-description">
            <p>
                Only the properties you changed appear here, so the snippet stays as short as the equivalent hand-written one. The code button expands it into the whole single file component, where you can switch between the Composition and Options
                API, and StackBlitz opens that same component ready to run.
            </p>
        </div>

        <!-- no `fullCode`: the tag on its own is the answer to what the controls did, and the code button is there for the rest of the component -->
        <DocSectionCode :code="code" :component="schema.component" />
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

/*
 * A grid of dots rather than a flat fill: it reads as a canvas at a glance, and it gives a white or
 * transparent component an edge to sit against without tinting the surface the component is judged on.
 */
.playground-canvas {
    background-color: var(--p-content-background);
    /* a stacking context, so the dot layer below can sit above this background and still stay under the component */
    isolation: isolate;
}

/*
 * The dots live on their own layer rather than on the pane: the pane would pass its mask down to the
 * component sitting on it, and the fade is only meant for the pattern.
 */
.playground-canvas::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    /*
     * The dot is the pane's own text color at a low alpha, so it inverts with the theme on its own.
     * A surface token would have to be picked per scheme, and a scheme-specific rule only works for
     * as long as it keeps matching whatever class the dark theme is switched with.
     */
    background-image: radial-gradient(color-mix(in srgb, currentColor 12%, transparent) 1px, transparent 0);
    background-size: 24px 24px;
    background-position: -12px -12px;
    /* the grid dissolves well inside the pane, so the edges and the corners stay empty */
    -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 100%);
    mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 100%);
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
