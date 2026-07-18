import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@openvue/auto-import-resolver';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    optimizeDeps: {
        include: ['openvue/button']
    }
});
