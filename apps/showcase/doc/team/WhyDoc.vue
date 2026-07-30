<template>
    <DocSectionText v-bind="$attrs">
        <p>
            We used PrimeVue daily for years, across projects big and small. It was one of the best UI libraries in the Vue ecosystem, and we did not want to see it stall behind a closed license. Thousands of teams still have it in their dependency
            tree, and every one of them deserves a version that keeps getting security fixes, Vue compatibility updates, and accessibility work.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div v-for="value in values" :key="value.title" class="border border-surface rounded-border p-4">
                <i :class="value.icon" class="text-primary text-xl" />
                <h4 class="mt-3 mb-2 text-lg font-semibold">{{ value.title }}</h4>
                <p class="m-0 text-base leading-normal text-surface-600 dark:text-surface-300">{{ value.description }}</p>
            </div>
        </div>
    </DocSectionText>
</template>

<script>
export default {
    data() {
        return {
            values: [
                {
                    icon: 'pi pi-unlock',
                    title: 'MIT, permanently',
                    description: 'Every package we publish is MIT licensed. A relicense upstream cannot reach them.'
                },
                {
                    icon: 'pi pi-box',
                    title: 'A stack we control',
                    description: 'Components, theming engine and icons are all maintained in the open by the same foundation.'
                },
                {
                    icon: 'pi pi-users',
                    title: 'Community run',
                    description: 'Decisions happen in public, on the issue tracker and in discussions, not behind a company roadmap.'
                }
            ]
        };
    }
};
</script>
