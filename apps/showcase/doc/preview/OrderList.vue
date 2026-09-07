<template>
    <Listbox :modelValue="cities[0]" :options="cities" optionLabel="name" class="w-full" />
</template>

<script>
export default {
    data() {
        return {
            cities: [{ name: 'Berlin' }, { name: 'Rome' }]
        };
    }
};
</script>
