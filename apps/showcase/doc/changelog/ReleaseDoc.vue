<template>
    <DocSectionText v-bind="$attrs">
        <p class="!text-base text-surface-500 dark:text-surface-400">
            <template v-if="release.unreleased">Merged on master, ships in the next release.</template>
            <template v-else>Released {{ formattedDate }}</template>
            <template v-if="release.compareUrl">
                &middot;
                <a :href="release.compareUrl" target="_blank" rel="noopener noreferrer">{{ release.unreleased ? 'Compare with latest release' : 'View changes on GitHub' }}</a>
            </template>
        </p>
        <div class="max-w-4xl">
            <p v-for="(paragraph, i) of release.intro" :key="i" class="leading-relaxed" v-html="paragraph"></p>
            <template v-for="group of release.groups" :key="group.title">
                <h3 class="mt-8 mb-4">{{ group.title }}</h3>
                <ul class="list-disc pl-6 m-0 space-y-4 leading-relaxed marker:text-surface-400 dark:marker:text-surface-500">
                    <li v-for="(item, i) of group.items" :key="i" class="pl-1" v-html="item"></li>
                </ul>
            </template>
        </div>
    </DocSectionText>
</template>

<script>
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default {
    inheritAttrs: false,
    computed: {
        release() {
            return this.$attrs.data;
        },
        // Formatted from the string rather than a Date so the day never shifts with the reader's timezone.
        formattedDate() {
            const [year, month, day] = this.release.date?.split('-') ?? [];

            return year ? `${MONTHS[month - 1]} ${Number(day)}, ${year}` : '';
        }
    }
};
</script>
