<template>
    <!-- inline keeps the control in a fixed column so every row in a group lines up -->
    <div v-if="!stacked" class="flex items-center justify-between gap-2 rounded-md px-2 py-1 transition-colors hover:bg-surface-100 dark:hover:bg-surface-700/50">
        <!-- the description hangs off the label, not the control, so reading about a property never means hovering the thing that changes it -->
        <label :for="controlId" v-tooltip.left="tooltip" :class="['flex min-w-0 items-center gap-1.5 text-sm text-muted-color', description && 'cursor-help']">
            <span class="truncate">{{ label }}</span>
            <!-- marks the properties carried into the generated code, so the rail says what you changed -->
            <span v-if="modified" class="size-1.5 shrink-0 rounded-full bg-primary" :title="`${label} differs from the default`"></span>
        </label>
        <!-- one fixed column for every control, so the rail reads as a single edge rather than a ragged one -->
        <div class="flex w-32 shrink-0 justify-end">
            <slot :id="controlId" />
        </div>
    </div>

    <!-- stacked gives a range control the full width, with its current value beside the label -->
    <div v-else class="flex flex-col gap-2 rounded-md px-2 py-1">
        <div class="flex items-center justify-between gap-3">
            <label :for="controlId" v-tooltip.left="tooltip" :class="['flex min-w-0 items-center gap-1.5 text-sm text-muted-color', description && 'cursor-help']">
                <span class="truncate">{{ label }}</span>
                <span v-if="modified" class="size-1.5 shrink-0 rounded-full bg-primary" :title="`${label} differs from the default`"></span>
            </label>
            <span v-if="value !== null" class="text-sm tabular-nums text-muted-color">{{ value }}</span>
        </div>
        <slot :id="controlId" />
    </div>
</template>

<script>
export default {
    name: 'ControlRow',
    props: {
        label: {
            type: String,
            required: true
        },
        controlId: {
            type: String,
            required: true
        },
        stacked: {
            type: Boolean,
            default: false
        },
        value: {
            type: [String, Number],
            default: null
        },
        modified: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
            default: null
        }
    },
    computed: {
        tooltip() {
            return this.description ? { value: this.description, class: 'max-w-64' } : null;
        }
    }
};
</script>
