<template>
    <DocSectionText v-bind="$attrs">
        <p>The Export menu in the editor footer offers three files and a share link.</p>
        <ul class="leading-relaxed">
            <li><b>TypeScript preset</b> — a <i>.ts</i> module exporting your theme, with the overrides annotated <i>satisfies Preset</i>.</li>
            <li><b>JavaScript preset</b> — the same module without the type annotations.</li>
            <li><b>Theme JSON</b> — a portable document you can re-import later or hand to a teammate.</li>
            <li><b>Share link</b> — a URL that reconstructs the theme. The theme travels in the URL fragment, which browsers never send to a server.</li>
        </ul>
        <p>
            By default the preset export contains only what you actually changed, expressed as a <i>definePreset</i> call against your base theme. That keeps the file small and means your theme keeps inheriting improvements to the base preset. A
            full-preset export is available if you would rather vendor a complete snapshot.
        </p>
        <p>Typography is deliberately excluded from the generated preset. Font family and root font size are preview conveniences that belong at the document level in your application, so the export records them as a comment instead.</p>
        <p>Exports are blocked while the theme contains unresolved token references or a reference cycle, because both produce CSS that silently fails to render. Run <b>Check Theme</b> in Settings to see the details.</p>
        <DocSectionCode :code="code" hideToggleCode hideStackBlitz />
    </DocSectionText>
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `import { definePreset } from '@openvue/themes';
import Aura from '@openvue/themes/aura';
import type { Preset } from '@openvue/themes';

const overrides = {
    semantic: {
        primary: {
            color: '{blue.500}'
        }
    }
} satisfies Preset;

export const MyTheme = definePreset(Aura, overrides);

export default MyTheme;`
            }
        };
    }
};
</script>
