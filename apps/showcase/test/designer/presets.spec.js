import { describe, expect, it } from 'vitest';
import Aura from '@openvue/themes/aura';
import Lara from '@openvue/themes/lara';
import Material from '@openvue/themes/material';
import Nora from '@openvue/themes/nora';
import { validatePreset } from '../../service/designer/validate';

/** Every preset the designer offers as a starting point. */
const ALL_PRESETS = { Aura, Lara, Material, Nora };

describe('themes/presets', () => {
    // The validator blocks export on unresolved references, so a false positive here would make
    // every shipped preset unexportable. Checking all of them keeps the resolver honest.
    describe.each(Object.entries(ALL_PRESETS).filter(([name]) => name !== 'Lara'))('%s validates cleanly', (name, preset) => {
        it('has no unresolved references or reference cycles', () => {
            const result = validatePreset(preset);

            expect(result.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
            expect(result.canExport).toBe(true);
        });
    });

    // Lara ships with genuinely unresolvable references upstream — `{sr.hover.color}` is a typo,
    // and `{help.400}` / `{danger.400}` name palettes that do not exist. Pinning the exact set
    // means a regression shows up as a diff rather than passing silently.
    describe('Lara has known upstream defects', () => {
        it('has exactly the five documented broken references', () => {
            const paths = validatePreset(Lara)
                .issues.filter((issue) => issue.code === 'broken-reference')
                .map((issue) => issue.path)
                .sort();

            expect(paths).toEqual(
                [
                    'components.button.colorScheme.dark.outlined.danger.activeBackground',
                    'components.button.colorScheme.dark.outlined.help.activeBackground',
                    'components.button.colorScheme.dark.outlined.danger.hoverBackground',
                    'components.button.colorScheme.dark.outlined.help.hoverBackground',
                    'components.treetable.row.hoverColor'
                ].sort()
            );
        });

        // A user who bases a theme on Lara must not be blocked by a defect they did not cause.
        it('does not block export for a theme derived from it', () => {
            const derived = structuredClone(Lara);

            derived.semantic.colorScheme.light.primary.color = '{blue.500}';

            const result = validatePreset(derived, Lara);

            expect(result.canExport).toBe(true);
            expect(result.issues.some((issue) => issue.inherited)).toBe(true);
        });

        // ...but a reference the user actually broke still blocks.
        it('still blocks export for a reference the user broke', () => {
            const derived = structuredClone(Lara);

            derived.semantic.colorScheme.light.primary.color = '{does.not.exist}';

            expect(validatePreset(derived, Lara).canExport).toBe(false);
        });
    });
});
