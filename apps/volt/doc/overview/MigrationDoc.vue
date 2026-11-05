<template>
    <DocSectionText v-bind="$attrs">
        <p>
            Already using Volt with PrimeVue? OpenVolt is the same set of components, so your copied files keep working. Run the OpenVue migration tool in your project, it rewrites the <i>primevue</i> imports in your Volt components and the rest of
            your code to <i>openvue</i>, and swaps the dependencies in <i>package.json</i>.
        </p>
        <DocSectionCode :code="code" lang="bash" />
        <p>Everything else stays as it is:</p>
        <ul class="leading-relaxed">
            <li>Your components in the <i>volt</i> folder and any customizations you made to them.</li>
            <li>The <i>tailwindcss-primeui</i> plugin and the <i>tailwind-merge</i> utility.</li>
            <li>The <i>--p-*</i> CSS variables in your global stylesheet.</li>
        </ul>
        <p>Preview the changes first with <i>npx @openvue/migrate --dry</i>. Visit the <a href="https://openvue.dev/migrate" target="_blank" rel="noopener noreferrer">migration guide</a> for the full list of what the tool changes.</p>
    </DocSectionText>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const code = ref(`
npx @openvue/migrate
`);
</script>
