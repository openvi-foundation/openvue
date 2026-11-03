// Regenerates service/theme/google-fonts.json: node apps/showcase/scripts/build-google-fonts.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const SOURCE = 'https://fonts.google.com/metadata/fonts';
const OUTPUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../service/theme/google-fonts.json');

const CATEGORIES = { 'Sans Serif': 's', Serif: 'f', Display: 'd', Handwriting: 'h', Monospace: 'm' };

const response = await fetch(SOURCE);

if (!response.ok) {
    throw new Error(`Could not read ${SOURCE}: ${response.status}`);
}

const { familyMetadataList } = JSON.parse((await response.text()).replace(/^\)\]\}'/, ''));

const families = familyMetadataList
    .filter((family) => family.subsets.includes('latin'))
    .filter((family) => !(family.colorCapabilities || []).length && !/Emoji|Symbols/.test(family.family))
    .filter((family) => CATEGORIES[family.category])
    .sort((a, b) => a.popularity - b.popularity)
    .map((family) => {
        const weights = Object.keys(family.fonts)
            .filter((style) => /^\d+$/.test(style))
            .map(Number)
            .sort((a, b) => a - b);

        return [family.family, CATEGORIES[family.category], weights];
    })
    .filter(([, , weights]) => weights.length);

fs.writeFileSync(OUTPUT, JSON.stringify({ source: SOURCE, generated: new Date().toISOString().slice(0, 10), families }) + '\n');

console.log(`Wrote ${families.length} families to ${path.relative(process.cwd(), OUTPUT)}`);
