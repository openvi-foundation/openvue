<template>
    <section class="flex flex-col">
        <!--
            A plain heading unless the group can be collapsed, in which case the heading is the
            control that does it. It sticks to the top of the rail so the group a row belongs to
            stays named while a long list scrolls past.
        -->
        <button
            v-if="collapsible"
            type="button"
            class="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-surface bg-surface-50 px-3 py-2 text-left transition-colors hover:bg-surface-100 dark:bg-surface-800 dark:hover:bg-surface-700"
            :aria-expanded="open"
            @click="open = !open"
        >
            <span class="text-xs font-semibold uppercase tracking-wider text-muted-color">{{ title }}</span>
            <i :class="['pi pi-chevron-down text-xs text-muted-color transition-transform duration-200 ease-out motion-reduce:transition-none', { 'rotate-180': open }]" aria-hidden="true"></i>
        </button>
        <p v-else class="px-4 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-color">{{ title }}</p>

        <!-- 0fr to 1fr animates to the content's own height, which a plain height transition cannot do -->
        <div :class="['grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]']">
            <div class="overflow-hidden">
                <div class="flex flex-col gap-0.5 px-2 pb-2.5 pt-1.5">
                    <slot />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'ControlGroup',
    props: {
        title: {
            type: String,
            required: true
        },
        collapsible: {
            type: Boolean,
            default: false
        },
        defaultOpen: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            open: this.defaultOpen
        };
    }
};
</script>
