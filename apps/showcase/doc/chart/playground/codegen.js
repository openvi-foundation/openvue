/*
 * Generates the source shown under the playground. The data and options objects are serialized
 * straight from the objects handed to the component, so the generated code cannot drift from the
 * chart above it.
 */

import { closingScript, serialize } from '@/components/doc/playground/serialize';

/**
 * Returns the three code variants DocSectionCode expects: the tag on its own, plus a complete
 * single file component in each API style.
 */
export function buildCode({ type, themed, data, options, className }) {
    const attributes = [`type="${type}"`, ':data="chartData"', ':options="chartOptions"'];

    if (!themed) attributes.push(':themed="false"');
    if (className) attributes.push(`class="${className}"`);

    const tag = `<Chart ${attributes.join(' ')} />`;

    const template = `<template>
    <div class="card">
        ${tag}
    </div>
</template>`;

    return {
        basic: tag,
        options: `${template}

<script>
export default {
    data() {
        return {
            chartData: ${serialize(data, 12)},
            chartOptions: ${serialize(options, 12)}
        };
    }
};
${closingScript}`,
        composition: `${template}

<script setup>
import { ref } from 'vue';

const chartData = ref(${serialize(data, 0)});

const chartOptions = ref(${serialize(options, 0)});
${closingScript}`
    };
}
