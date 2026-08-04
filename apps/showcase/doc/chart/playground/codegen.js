/*
 * Generates the source shown under the playground. The data and options objects are serialized
 * straight from the objects handed to the component, so the generated code cannot drift from the
 * chart above it.
 */

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;
const INLINE_WIDTH = 80;

const quote = (value) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const key = (name) => (IDENTIFIER.test(name) ? name : quote(name));
const isPrimitive = (value) => value === null || typeof value !== 'object';

/**
 * Serializes a value as a JavaScript literal. `indent` is the column the closing bracket sits at,
 * which is what lets a nested literal be dropped into an already indented template.
 */
export function serialize(value, indent = 0) {
    const pad = ' '.repeat(indent);
    const inner = ' '.repeat(indent + 4);

    if (value === null) return 'null';
    if (typeof value === 'string') return quote(value);
    if (typeof value !== 'object') return String(value);

    if (Array.isArray(value)) {
        if (!value.length) return '[]';

        if (value.every(isPrimitive)) return `[${value.map((item) => serialize(item)).join(', ')}]`;

        const items = value.map((item) => `${inner}${serialize(item, indent + 4)}`);
        const inline = `[${value.map((item) => serialize(item)).join(', ')}]`;

        // a row of small point objects reads better on one line than one object per line
        return inline.length + indent <= INLINE_WIDTH && !inline.includes('\n') ? inline : `[\n${items.join(',\n')}\n${pad}]`;
    }

    const entries = Object.entries(value).filter(([, item]) => item !== undefined);

    if (!entries.length) return '{}';

    if (entries.every(([, item]) => isPrimitive(item))) {
        const inline = `{ ${entries.map(([name, item]) => `${key(name)}: ${serialize(item)}`).join(', ')} }`;

        if (inline.length + indent <= INLINE_WIDTH) return inline;
    }

    return `{\n${entries.map(([name, item]) => `${inner}${key(name)}: ${serialize(item, indent + 4)}`).join(',\n')}\n${pad}}`;
}

const closingScript = `</${'script'}>`;

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
