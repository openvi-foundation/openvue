import { describe, expect, it, vi } from 'vitest';
import { FONTS, UI_WEIGHTS, fontStylesheetUrl, isFontFamily } from '../../service/theme/compile';
import { CATEGORIES, SAMPLE_TEXT, fontWeights, loadFontCatalogue, previewFontUrl, resolveFontUrl } from '../../service/theme/fonts';

describe('theme-builder/fonts', () => {
    describe('catalogue', () => {
        it('holds the Google Fonts families that can set interface text', async () => {
            const catalogue = await loadFontCatalogue();
            const families = catalogue.map((entry) => entry.family);

            expect(catalogue.length).toBeGreaterThan(1500);
            expect(new Set(families).size).toBe(families.length);
            expect(families).not.toContain('Noto Color Emoji');

            for (const entry of catalogue) {
                expect(isFontFamily(entry.family), entry.family).toBe(true);
                expect(Object.values(CATEGORIES)).toContain(entry.category);
                expect(entry.weights.length, entry.family).toBeGreaterThan(0);
                expect(
                    [...entry.weights].sort((a, b) => a - b),
                    entry.family
                ).toEqual(entry.weights);
            }
        });

        it('includes every curated font with the interface weights', async () => {
            const catalogue = await loadFontCatalogue();

            for (const font of FONTS.filter((name) => name !== 'Inter var')) {
                const entry = catalogue.find((item) => item.family === font);

                expect(entry, font).toBeTruthy();
                expect(
                    UI_WEIGHTS.every((weight) => entry.weights.includes(weight)),
                    font
                ).toBe(true);
            }
        });
    });

    describe('fontStylesheetUrl', () => {
        it('asks only for weights the family has', () => {
            expect(fontStylesheetUrl('Lobster', [400])).toContain('family=Lobster:wght@400&');
            expect(fontStylesheetUrl('Space Grotesk', [300, 400, 500, 600, 700])).toContain('family=Space+Grotesk:wght@400;500;600;700&');
            // Buda ships only a light weight; asking for 400 would make Google Fonts refuse the request.
            expect(fontStylesheetUrl('Buda', [300])).toContain('family=Buda:wght@300&');
        });
    });

    describe('fontWeights and resolveFontUrl', () => {
        it('skips the catalogue for curated fonts and looks the rest up', async () => {
            expect(await fontWeights('Figtree')).toEqual(UI_WEIGHTS);
            expect(await fontWeights('Lobster')).toEqual([400]);
            expect(await fontWeights('Not A Real Family')).toEqual([400]);
        });

        it('builds the stylesheet URL, and none for the site’s own Inter', async () => {
            expect(await resolveFontUrl('Inter var')).toBeNull();
            expect(await resolveFontUrl('Lobster')).toBe('https://fonts.googleapis.com/css2?family=Lobster:wght@400&display=swap');
        });

        // A theme with a catalogue font must still apply while the catalogue cannot be downloaded.
        it('falls back to the regular weight when the catalogue fails, and tries again next time', async () => {
            vi.resetModules();
            vi.doMock('../../service/theme/google-fonts.json', () => {
                throw new Error('offline');
            });

            const fonts = await import('../../service/theme/fonts');

            await expect(fonts.loadFontCatalogue()).rejects.toThrow();
            expect(await fonts.resolveFontUrl('Playfair Display')).toBe('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400&display=swap');

            vi.doUnmock('../../service/theme/google-fonts.json');

            expect(await fonts.fontWeights('Playfair Display')).toContain(700);
        });
    });

    describe('previewFontUrl', () => {
        it('subsets the regular weight to the name and the sample sentence', () => {
            const url = previewFontUrl({ family: 'Playfair Display', weights: [400, 700] });
            const text = decodeURIComponent(url.split('&text=')[1].split('&')[0]);

            expect(url).toContain('family=Playfair+Display:wght@400&');
            expect([...new Set('Playfair Display' + SAMPLE_TEXT)].every((character) => text.includes(character))).toBe(true);
        });

        it('falls back to the family’s first weight when it has no regular', () => {
            expect(previewFontUrl({ family: 'Buda', weights: [300] })).toContain('wght@300&');
        });
    });

    describe('isFontFamily', () => {
        it('accepts Google family names and nothing that could break out of CSS or a URL', () => {
            expect(isFontFamily('Plus Jakarta Sans')).toBe(true);
            expect(isFontFamily('Libre Barcode 39')).toBe(true);

            for (const value of ['', 'Roboto"; color: red', "Roboto'", 'Roboto;', 'a  b', 'Roboto ', ' Roboto', 'x'.repeat(60), null, 42]) {
                expect(isFontFamily(value), String(value)).toBe(false);
            }
        });
    });
});
