import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';

export default defineConfig({
    plugins: [vue(), Components({ dts: 'src/components.d.ts', directives: true, resolvers: PrimeVueResolver() })],
    optimizeDeps: { include: ['primevue/button', 'primevue/inputtext'] },
    preview: { port: Number(process.env.OPENVUE_TEST_PORT || 4173) }
});
