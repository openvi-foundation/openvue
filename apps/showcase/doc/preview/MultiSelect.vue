<template>
    <MultiSelect :modelValue="[cities[0], cities[1]]" :options="cities" optionLabel="name" fluid />
</template>

<script>
export default {
    data() {
        return {
            cities: [{ name: 'Berlin' }, { name: 'Rome' }, { name: 'Paris' }]
        };
    }
};
</script>
