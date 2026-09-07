<template>
    <MeterGroup :value="meters" class="w-full" />
</template>

<script>
export default {
    data() {
        return {
            meters: [
                { label: 'Apps', value: 45 },
                { label: 'Media', value: 25 }
            ]
        };
    }
};
</script>
