<template>
    <DocSectionText v-bind="$attrs">
        <p>
            Here is the full list of OpenIcons. More icons will be added periodically and you may also
            <a href="https://github.com/openvi-foundation/openicons/issues">request new icons</a> at the issue tracker.
        </p>
    </DocSectionText>

    <InputText v-model="filter" class="w-full p-4 mt-4 mb-2" placeholder="Search an icon" />

    <p class="mb-6 text-sm text-surface-500 dark:text-surface-400">{{ filteredIcons.length }} of {{ icons.length }} icons</p>

    <div class="card">
        <div class="grid grid-cols-12 gap-4 text-center">
            <div v-for="icon of filteredIcons" :key="icon.name" class="col-span-12 md:col-span-2 mb-8">
                <i :class="'text-2xl mb-4 text-surface-500 dark:text-surface-400 oi oi-' + icon.name"></i>
                <div class="break-all">oi-{{ icon.name }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { IconService } from '@/service/IconService';

const sanitize = (value) =>
    value
        .replace(/[^\w\s]/gi, '')
        .replace(/\s/g, '')
        .toLowerCase();

export default {
    data() {
        return {
            icons: [],
            filter: null
        };
    },
    mounted() {
        IconService.getIcons().then((data) => {
            this.icons = [...data].sort((icon1, icon2) => icon1.name.localeCompare(icon2.name));
        });
    },
    computed: {
        filteredIcons() {
            const sanitizedInput = this.filter ? sanitize(this.filter) : null;

            if (!sanitizedInput) return this.icons;

            return this.icons.filter((icon) => sanitize(icon.name).includes(sanitizedInput) || icon.tags.some((tag) => sanitize(tag).includes(sanitizedInput)));
        }
    }
};
</script>
