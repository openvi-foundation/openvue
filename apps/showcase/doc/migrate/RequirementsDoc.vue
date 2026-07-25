<template>
    <DocSectionText v-bind="$attrs">
        <ul class="leading-relaxed">
            <li>Node.js 18 or newer.</li>
            <li>
                Your project must be on PrimeVue 4.x, the fork point. The tool detects the installed major from <i>package.json</i>, a <i>catalog:</i> or <i>workspace:</i> protocol, <i>node_modules</i> or the lockfile, and stops without changing
                anything if it finds a non-4.x version. Coming from v3 or earlier, apply the <NuxtLink to="/guides/migration/v4" class="doc-link">PrimeVue v4 migration guide</NuxtLink> first, then run the tool.
            </li>
        </ul>
    </DocSectionText>
</template>
