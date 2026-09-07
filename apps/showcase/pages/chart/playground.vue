<template>
    <div>
        <DocSeo title="Chart Playground - OpenVue" description="Build a chart interactively, edit its data, and copy the generated code." />

        <div class="doc">
            <PlaygroundDoc />
        </div>
    </div>
</template>

<script>
import PlaygroundDoc from '@/doc/chart/PlaygroundDoc.vue';

export default {
    components: {
        PlaygroundDoc
    }
};
</script>
