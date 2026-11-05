<template>
    <section class="landing-migration py-20 px-8 lg:px-20">
        <div class="migration-grid">
            <div class="migration-content">
                <h2 class="migration-title">Coming from PrimeVue 4?</h2>
                <p class="migration-text">Same components, props, slots, themes and pass-through API. Only the package names change, and one command rewrites them for you.</p>
                <ul class="migration-points">
                    <li v-for="point of points" :key="point">
                        <i class="pi pi-check" aria-hidden="true"></i>
                        <span>{{ point }}</span>
                    </li>
                </ul>
                <div class="migration-command">
                    <span class="migration-command-prompt" aria-hidden="true">$</span>
                    <code class="migration-command-text">{{ command }}</code>
                    <button type="button" class="migration-command-copy" :aria-label="`Copy ${command} to clipboard`" @click="copyCommand">
                        <i :class="['pi', copied ? 'pi-check' : 'pi-copy']"></i>
                    </button>
                </div>
                <OpenVueNuxtLink to="/migrate" class="migration-link">
                    <span>Read the migration guide</span>
                    <i class="pi pi-arrow-right"></i>
                </OpenVueNuxtLink>
            </div>

            <!-- Taken from a real run of the codemod on a Vite + PrimeVue 4.5.5 app; keep it in sync with packages/migrate. -->
            <div class="migration-diff">
                <Tabs v-model:value="activeFile">
                    <TabList>
                        <Tab v-for="file of files" :key="file.name" :value="file.name">{{ file.name }}</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel v-for="file of files" :key="file.name" :value="file.name">
                            <pre
                                class="migration-diff-body"
                            ><code><span v-for="(line, i) of file.lines" :key="i" :class="['migration-diff-line', line.type && `is-${line.type}`]"><span class="migration-diff-sign" aria-hidden="true">{{ signs[line.type] }}</span><template v-for="(part, j) of segments(line)" :key="j"><mark v-if="part.mark">{{ part.text }}</mark><template v-else>{{ part.text }}</template></template></span></code></pre>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                <div class="migration-diff-footer">Nothing else in your code changes.</div>
            </div>
        </div>
    </section>
</template>

<script>
import pkg from '../../../../packages/primevue/package.json';

const del = (text, ...marks) => ({ type: 'del', text, marks });
const add = (text, ...marks) => ({ type: 'add', text, marks });
const ctx = (text) => ({ text, marks: [] });

export default {
    data() {
        const version = pkg.version;

        return {
            command: 'npx @openvue/migrate',
            copied: false,
            copyTimeout: null,
            activeFile: 'package.json',
            signs: { del: '-', add: '+' },
            points: ['Renames dependencies in every package.json, monorepos included', 'Rewrites imports in .js, .ts and .vue files and your Nuxt or Vite config', 'Lists anything it could not change, with file and line'],
            files: [
                {
                    name: 'package.json',
                    lines: [
                        ctx('"dependencies": {'),
                        del('  "@primeuix/themes": "^1.2.5",', '@primeuix/themes', '^1.2.5'),
                        add(`  "@openvue/themes": "${version}",`, '@openvue/themes', version),
                        ctx('  "primeicons": "^7.0.0",'),
                        del('  "primevue": "^4.5.5",', 'primevue', '^4.5.5'),
                        add(`  "openvue": "${version}",`, 'openvue', version),
                        ctx('  "vue": "^3.5.0"'),
                        ctx('}')
                    ]
                },
                {
                    name: 'main.js',
                    lines: [
                        ctx("import { createApp } from 'vue';"),
                        del("import PrimeVue from 'primevue/config';", 'primevue'),
                        del("import Aura from '@primeuix/themes/aura';", '@primeuix/themes'),
                        add("import PrimeVue from 'openvue/config';", 'openvue'),
                        add("import Aura from '@openvue/themes/aura';", '@openvue/themes'),
                        ctx("import App from './App.vue';"),
                        ctx(''),
                        ctx('createApp(App)'),
                        ctx('    .use(PrimeVue, { theme: { preset: Aura } })'),
                        ctx("    .mount('#app');")
                    ]
                },
                {
                    name: 'App.vue',
                    lines: [
                        ctx('<script setup>'),
                        del("import Button from 'primevue/button';", 'primevue'),
                        add("import Button from 'openvue/button';", 'openvue'),
                        ctx('<\/script>'),
                        ctx(''),
                        ctx('<template>'),
                        ctx('    <Button label="Save" />'),
                        ctx('</template>')
                    ]
                }
            ]
        };
    },
    beforeUnmount() {
        if (this.copyTimeout) {
            clearTimeout(this.copyTimeout);
        }
    },
    methods: {
        async copyCommand() {
            try {
                await navigator.clipboard.writeText(this.command);
            } catch {
                return;
            }

            this.copied = true;

            if (this.copyTimeout) {
                clearTimeout(this.copyTimeout);
            }

            this.copyTimeout = setTimeout(() => (this.copied = false), 2000);
        },
        // Splits a line into plain and highlighted runs so only the renamed tokens stand out.
        segments(line) {
            const parts = [];
            let rest = line.text;

            for (const mark of line.marks) {
                const index = rest.indexOf(mark);

                if (index === -1) continue;

                if (index > 0) parts.push({ text: rest.slice(0, index) });

                parts.push({ text: mark, mark: true });
                rest = rest.slice(index + mark.length);
            }

            if (rest) parts.push({ text: rest });

            return parts;
        }
    }
};
</script>
