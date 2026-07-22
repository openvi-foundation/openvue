import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [laravel({ input: ['resources/js/app.ts'], refresh: false }), vue()]
});
