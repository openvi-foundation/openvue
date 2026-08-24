<template>
    <DatePicker :modelValue="date" showIcon fluid />
</template>

<script>
export default {
    data() {
        return {
            date: new Date(2026, 0, 15)
        };
    }
};
</script>
