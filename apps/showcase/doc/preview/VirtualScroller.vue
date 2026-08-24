<template>
    <VirtualScroller :items="items" :itemSize="32" class="w-full border border-surface rounded" style="height: 6rem"
        ><template #item="{ item }"
            ><div class="px-3 py-2 text-sm">{{ item }}</div></template
        ></VirtualScroller
    >
</template>

<script>
export default {
    data() {
        return {
            items: Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`)
        };
    }
};
</script>
