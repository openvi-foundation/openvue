import { describe, expect, it } from 'vitest';
import { buildCustomTokens } from '../../service/designer/custom';

describe('custom token drafts', () => {
    it('builds nested tokens without changing the draft', () => {
        const rows = [
            { name: 'accent.color', value: '#123456' },
            { name: 'accent.background', value: '{accent.color}' }
        ];
        const before = structuredClone(rows);

        expect(buildCustomTokens(rows)).toEqual({ ok: true, tokens: { accent: { color: '#123456', background: '{accent.color}' } } });
        expect(rows).toEqual(before);
        expect(buildCustomTokens([])).toEqual({ ok: true, tokens: {} });
    });

    it.each([{}, { name: '', value: '' }, { name: 'accent.color', value: '' }, { name: 'accent..color', value: '#fff' }, { name: '__proto__.polluted', value: 'yes' }, { name: 'constructor.prototype.polluted', value: 'yes' }])(
        'rejects incomplete or unsafe rows: %j',
        (row) => {
            expect(buildCustomTokens([{ name: 'existing.color', value: '#000' }, row]).ok).toBe(false);
            expect(Object.prototype).not.toHaveProperty('polluted');
        }
    );

    it.each([
        ['accent', 'accent.color'],
        ['accent.color', 'accent'],
        ['accent.color', 'accent.color']
    ])('rejects overlapping names %s and %s', (first, second) => {
        expect(
            buildCustomTokens([
                { name: first, value: '#000' },
                { name: second, value: '#fff' }
            ]).ok
        ).toBe(false);
    });
});
