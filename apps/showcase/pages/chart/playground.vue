<template>
    <div>
        <Head>
            <Title>Chart Playground - OpenVue</Title>
            <Meta name="description" content="Build a chart interactively, edit its data, and copy the generated code." />
        </Head>

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
