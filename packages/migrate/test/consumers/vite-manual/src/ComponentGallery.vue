<template>
    <section aria-label="OpenVue component surface" class="component-gallery">
        <div v-for="entry in components" :key="entry.name" :data-openvue-component="entry.name">
            <component :is="entry.component" v-if="!composedComponents.has(entry.name)" v-bind="minimumProps(entry.name)">OpenVue</component>
        </div>
    </section>
</template>

<script setup lang="ts">
import { onErrorCaptured } from 'vue';
import type { SurfaceComponent } from './surface';

defineProps<{ components: SurfaceComponent[] }>();

onErrorCaptured((error, instance, info) => {
    console.error(`Surface component ${instance?.$options.name ?? 'unknown'} failed during ${info}`, error);

    return false;
});

const composedComponents = new Set([
    'accordion',
    'accordioncontent',
    'accordionheader',
    'accordionpanel',
    'accordiontab',
    'checkboxgroup',
    'column',
    'columngroup',
    'confirmdialog',
    'confirmpopup',
    'datatable',
    'dynamicdialog',
    'form',
    'formfield',
    'inputgroup',
    'inputgroupaddon',
    'radiobuttongroup',
    'row',
    'splitter',
    'splitterpanel',
    'step',
    'steplist',
    'stepitem',
    'steppanel',
    'steppanels',
    'stepper',
    'tab',
    'tablist',
    'tabpanel',
    'tabpanels',
    'tabs',
    'tabview',
    'toast',
    'treetable'
]);

const options = [
    { label: 'Alpha', value: 'alpha' },
    { label: 'Beta', value: 'beta' }
];
const nodes = [{ key: '0', label: 'Root', children: [{ key: '0-0', label: 'Leaf' }] }];
const cascadeOptions = [{ label: 'Root', children: [{ label: 'Leaf' }] }];

function minimumProps(name: string) {
    const props: Record<string, unknown> = {
        binary: true,
        data: { labels: ['A', 'B'], datasets: [{ label: 'Values', data: [1, 2] }] },
        files: [],
        itemSize: 28,
        items: options,
        max: 100,
        min: 0,
        model: options,
        modelValue: name === 'picklist' ? [options, []] : name === 'orderlist' ? options : name === 'knob' ? 40 : name === 'chips' || name === 'inputchips' || name === 'multiselect' ? [] : null,
        name: `surface-${name}`,
        options,
        rows: 2,
        source: options,
        target: [],
        totalRecords: 2,
        type: 'bar',
        value: name === 'organizationchart' ? nodes[0] : name.includes('tree') ? nodes : ['carousel', 'dataview', 'galleria', 'timeline'].includes(name) ? options : name === 'metergroup' ? [{ label: 'Used', value: 40 }] : 40
    };

    if (name === 'cascadeselect') Object.assign(props, { options: cascadeOptions, optionGroupChildren: ['children'], optionGroupLabel: 'label' });
    if (name === 'chart') props.options = { animation: false, responsive: false };
    if (name === 'image') props.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
    if (name === 'fileupload') Object.assign(props, { customUpload: true, mode: 'basic' });

    return props;
}
</script>

<style scoped>
.component-gallery {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
}
</style>
