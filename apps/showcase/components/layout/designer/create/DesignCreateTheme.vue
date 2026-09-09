<template>
    <section class="mb-6">
        <span class="block text-lg font-semibold mb-2">Theme Name</span>
        <input v-model="themeName" type="text" autocomplete="off" class="px-3 py-2 rounded-md border border-surface-300 dark:border-surface-700 flex-1" maxlength="25" @keydown.enter="createThemeFromPreset" />
    </section>

    <section class="mb-6">
        <div class="text-lg font-semibold mb-2">Foundation</div>
        <span class="block text-muted-color leading-6 mb-4">Choose a built-in theme as the starting point. Your theme inherits everything from it, so you only override what you want to change.</span>
        <div class="flex flex-col gap-4 border border-surface-200 dark:border-surface-700 rounded-md p-4">
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <button
                    v-for="presetOption of presetOptions"
                    :key="presetOption.value"
                    type="button"
                    @click="basePreset = presetOption.value"
                    :class="[
                        'flex flex-col items-start gap-1 border rounded-md px-3 py-2 text-left transition-colors duration-200',
                        {
                            'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-black dark:border-white': presetOption.value === basePreset,
                            'border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800': presetOption.value !== basePreset
                        }
                    ]"
                >
                    <span class="font-medium">{{ presetOption.label }}</span>
                    <span :class="['text-xs leading-4', presetOption.value === basePreset ? 'opacity-80' : 'text-muted-color']">{{ presetOption.description }}</span>
                </button>
            </div>
            <div class="flex justify-end">
                <button type="button" @click="createThemeFromPreset" class="btn-design">Create</button>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    inject: ['designerService'],
    data() {
        return {
            themeName: null,
            basePreset: 'Aura',
            presetOptions: [
                { label: 'Aura', value: 'Aura', description: 'The balanced default.' },
                { label: 'Lara', value: 'Lara', description: 'Rounded and friendly.' },
                { label: 'Nora', value: 'Nora', description: 'Sharp and corporate.' },
                { label: 'Material', value: 'Material', description: 'Material Design flavour.' }
            ]
        };
    },
    methods: {
        createThemeFromPreset() {
            if (this.themeName == null || !this.themeName.trim().length) {
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Name is required', life: 3000 });

                return;
            }

            this.designerService.createTheme({ name: this.themeName.trim(), base: this.basePreset });

            this.$appState.designer.activeTab = '0';
            this.$appState.designer.activeView = 'editor';
        }
    }
};
</script>
