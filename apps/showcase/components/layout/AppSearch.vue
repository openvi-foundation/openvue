<template>
    <Dialog v-model:visible="visible" modal dismissableMask :showHeader="false" position="top" class="layout-search-dialog" @show="onShow" @hide="onHide">
        <IconField class="layout-search-input">
            <InputIcon class="pi pi-search" />
            <InputText ref="input" v-model="query" placeholder="Search" autocomplete="off" aria-label="Search" @keydown="onKeyDown" />
        </IconField>
        <div ref="resultsContainer" class="layout-search-results">
            <template v-for="(group, groupIndex) in groupedResults" :key="groupIndex">
                <span class="layout-search-group">{{ group.name }}</span>
                <ul>
                    <li v-for="item in group.items" :key="item.index" :class="['layout-search-item', { 'layout-search-item-active': item.index === activeIndex }]" @mouseenter="activeIndex = item.index" @click="navigate(item)">
                        <span class="layout-search-item-name">
                            <span>{{ item.pre }}</span
                            ><mark v-if="item.match">{{ item.match }}</mark
                            ><span>{{ item.post }}</span>
                            <Tag v-if="item.badge" :value="item.badge" class="layout-search-item-badge" />
                            <i v-if="item.href" class="pi pi-external-link"></i>
                        </span>
                        <span v-if="item.description" class="layout-search-item-description">{{ item.description }}</span>
                    </li>
                </ul>
            </template>
            <div v-if="query && !flatResults.length" class="layout-search-empty">No results for "{{ query }}"</div>
        </div>
    </Dialog>
</template>

<script>
import EventBus from '@/app/AppEventBus';
import searchIndex from '@/assets/data/search-index.json';

export default {
    keydownListener: null,
    searchListener: null,
    data() {
        return {
            visible: false,
            query: '',
            activeIndex: 0
        };
    },
    mounted() {
        this.keydownListener = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                this.visible = !this.visible;
            }
        };
        this.searchListener = () => {
            this.visible = true;
        };
        window.addEventListener('keydown', this.keydownListener);
        EventBus.on('open-search', this.searchListener);
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.keydownListener);
        EventBus.off('open-search', this.searchListener);
    },
    watch: {
        query() {
            this.activeIndex = 0;
        }
    },
    computed: {
        flatResults() {
            const q = this.query.trim().toLowerCase();

            if (!q) {
                const perGroup = {};
                const results = [];

                for (const entry of searchIndex) {
                    const topGroup = entry.group.split(' / ')[0];

                    perGroup[topGroup] = (perGroup[topGroup] || 0) + 1;

                    if (perGroup[topGroup] <= 2) {
                        results.push(entry);
                    }
                }

                return results;
            }

            const scored = [];

            for (const entry of searchIndex) {
                const name = entry.name.toLowerCase();
                const desc = (entry.description || '').toLowerCase();
                let score = 0;

                if (name.startsWith(q)) score = 100;
                else if (name.includes(q)) score = 60;
                else if (desc.includes(q)) score = 25;

                if (score) {
                    scored.push({ ...entry, score });
                }
            }

            scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

            return scored.slice(0, 15);
        },
        groupedResults() {
            const q = this.query.trim().toLowerCase();
            const groups = [];
            let index = 0;

            for (const entry of this.flatResults) {
                const matchIndex = q ? entry.name.toLowerCase().indexOf(q) : -1;
                const item = {
                    ...entry,
                    index: index++,
                    pre: matchIndex >= 0 ? entry.name.slice(0, matchIndex) : entry.name,
                    match: matchIndex >= 0 ? entry.name.slice(matchIndex, matchIndex + q.length) : '',
                    post: matchIndex >= 0 ? entry.name.slice(matchIndex + q.length) : ''
                };

                const lastGroup = groups[groups.length - 1];

                if (lastGroup && lastGroup.name === entry.group) {
                    lastGroup.items.push(item);
                } else {
                    groups.push({ name: entry.group, items: [item] });
                }
            }

            return groups;
        }
    },
    methods: {
        onShow() {
            this.$refs.input?.$el?.focus();
        },
        onHide() {
            this.query = '';
            this.activeIndex = 0;
        },
        onKeyDown(event) {
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    this.activeIndex = Math.min(this.activeIndex + 1, this.flatResults.length - 1);
                    this.scrollActiveIntoView();
                    break;

                case 'ArrowUp':
                    event.preventDefault();
                    this.activeIndex = Math.max(this.activeIndex - 1, 0);
                    this.scrollActiveIntoView();
                    break;

                case 'Enter':
                    event.preventDefault();
                    this.navigate(this.flatResults[this.activeIndex]);
                    break;

                default:
                    break;
            }
        },
        navigate(item) {
            if (!item) {
                return;
            }

            if (item.href) {
                window.open(item.href, '_blank');
            } else {
                this.$router.push(item.to);
            }

            this.visible = false;
        },
        scrollActiveIntoView() {
            this.$nextTick(() => {
                this.$refs.resultsContainer?.querySelector('.layout-search-item-active')?.scrollIntoView({ block: 'nearest' });
            });
        }
    }
};
</script>
