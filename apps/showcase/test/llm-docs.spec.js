import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('generated Nuxt documentation', () => {
    it.each(['../server/assets/llms/components.json', '../../../packages/mcp/data/components.json'])('has current, unique Nuxt sections in %s', (file) => {
        const data = JSON.parse(readFileSync(new URL(file, import.meta.url), 'utf8'));
        const sections = data.pages.find((page) => page.name === 'nuxt').sections;
        const ids = sections.map((section) => section.id);
        const download = sections.find((section) => section.id === 'download');

        expect(new Set(ids).size).toBe(ids.length);
        expect(download.examples.basic).toContain('npm install openvue @openvue/themes');
        expect(download.examples.basic).toContain('@openvue/nuxt-module');
        expect(JSON.stringify(sections)).not.toContain('@beta');
        expect(JSON.stringify(sections)).not.toContain('@rc');
    });
});
