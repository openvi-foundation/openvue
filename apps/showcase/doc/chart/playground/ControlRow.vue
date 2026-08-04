<template>
    <!-- inline keeps the control in a fixed column so every row in a group lines up -->
    <div v-if="!stacked" class="flex items-center justify-between gap-3">
        <label :for="controlId" class="text-sm">{{ label }}</label>
        <div class="flex w-36 shrink-0 justify-end">
            <slot :id="controlId" />
        </div>
    </div>

    <!-- stacked gives a range control the full width, with its current value beside the label -->
    <div v-else class="flex flex-col gap-2">
        <div class="flex items-center justify-between gap-3">
            <label :for="controlId" class="text-sm">{{ label }}</label>
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
        }
    }
};
</script>
