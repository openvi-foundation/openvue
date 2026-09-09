<template>
    <Fieldset legend="Rounded" :toggleable="true">
        <section class="grid grid-cols-4 gap-x-2 gap-y-3">
            <div v-for="option of options" :key="option.key" class="flex flex-col gap-1">
                <DesignTokenField v-model="$appState.designer.theme.preset.primitive.borderRadius[option.key]" :label="option.label" :path="'primitive.borderRadius.' + option.key" />
            </div>
        </section>
    </Fieldset>
</template>

<script>
export default {
    data() {
        return {
            options: [
                { key: 'none', label: 'None' },
                { key: 'xs', label: 'Extra Small' },
                { key: 'sm', label: 'Small' },
                { key: 'md', label: 'Medium' },
                { key: 'lg', label: 'Large' },
                { key: 'xl', label: 'Extra Large' }
            ]
        };
    }
};
</script>
