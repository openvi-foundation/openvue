import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const rootDir = path.resolve(dirname(fileURLToPath(import.meta.url)), '../');
const menu = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'assets/menu/menu.json'), { encoding: 'utf-8' }));

const extractDescription = (to) => {
    const pagePath = path.resolve(rootDir, 'pages', ...to.replace(/^\//, '').split('/'), 'index.vue');

    if (!fs.existsSync(pagePath)) {
        return null;
    }

    const content = fs.readFileSync(pagePath, { encoding: 'utf-8' });

    return content.match(/\bdescription="([^"]+)"/)?.[1] ?? content.match(/name="description"\s+content="([^"]+)"/)?.[1] ?? null;
};

const toEntry = (item, trail) => ({
    name: item.name,
    to: item.to ?? null,
    href: item.href ?? null,
    group: trail.join(' / '),
    description: item.to ? extractDescription(item.to) : null,
    badge: item.badge ?? null
});

const flatten = (items, trail = []) => items.flatMap((item) => (item.children ? flatten(item.children, [...trail, item.name]) : item.to || item.href ? [toEntry(item, trail)] : []));

const entries = flatten(menu.data);
const missing = entries.filter((entry) => entry.to && !entry.description);

const outDir = path.resolve(rootDir, 'assets/data');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.resolve(outDir, 'search-index.json'), JSON.stringify(entries, null, 4) + '\n', { encoding: 'utf8' });

console.log(`Search index: ${entries.length} entries written to assets/data/search-index.json`);

if (missing.length) {
    console.warn(`Search index: no description found for ${missing.map((entry) => entry.to).join(', ')}`);
}
