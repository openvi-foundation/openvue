import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [vue()],
    server: { port: Number(process.env.OPENVUE_TEST_PORT || 4173) },
    preview: { port: Number(process.env.OPENVUE_TEST_PORT || 4173) }
});
