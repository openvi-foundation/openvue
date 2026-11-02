import { defineEventHandler, setHeader } from 'h3';

// llms.txt crawlers look for the file at the site root; serve the generated copy from server assets.
export default defineEventHandler(async (event) => {
    setHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
    setHeader(event, 'Cache-Control', 'public, max-age=3600');

    return useStorage('assets:server').getItem('llms/llms.txt');
});
