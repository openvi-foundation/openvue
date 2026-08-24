<template>
    <Timeline :value="events">
        <template #content="slotProps">
            <span class="text-sm">{{ slotProps.item }}</span>
        </template>
    </Timeline>
</template>

<script>
export default {
    data() {
        return {
            events: ['Ordered', 'Delivered']
        };
    }
};
</script>
