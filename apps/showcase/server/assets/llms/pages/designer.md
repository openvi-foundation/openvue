# Theme Designer

Design a theme visually and export it as ready-to-use code. Free, MIT-licensed, and entirely local.

## Visual Editor

The editor is organised by token collection, matching the theming architecture. Primitive — the raw palettes and border radii. Values here are plain colours and lengths, referenced by everything else. Semantic — roles such as primary , formField and the light and dark colour schemes. Most theming work happens here. Component — tokens for one component at a time. This tab activates on a component's documentation page and selects that component automatically. Custom — your own tokens, added under extend . Use dot-separated lowercase names such as accent.color . Settings — preview typography, theme validation and the migration assistant. Any field accepts either a literal value or a reference to another token in curly braces. Typing an opening brace opens autocompletion over every token in the current theme. Fields whose value resolves to a colour show a swatch, and the sort icon moves a token between the shared section and the light or dark colour scheme. Edits apply live to the whole site, so you are previewing on real components rather than a mock screen. Undo and redo are available with Ctrl+Z and Ctrl+Shift+Z while the editor is open.

## Export and Sharing

The Export menu in the editor footer offers three files and a share link. TypeScript preset — a .ts module exporting your theme, with the overrides annotated satisfies Preset . JavaScript preset — the same module without the type annotations. Theme JSON — a portable document you can re-import later or hand to a teammate. Share link — a URL that reconstructs the theme. The theme travels in the URL fragment, which browsers never send to a server. By default the preset export contains only what you actually changed, expressed as a definePreset call against your base theme. That keeps the file small and means your theme keeps inheriting improvements to the base preset. A full-preset export is available if you would rather vendor a complete snapshot. Typography is deliberately excluded from the generated preset. Font family and root font size are preview conveniences that belong at the document level in your application, so the export records them as a comment instead. Exports are blocked while the theme contains unresolved token references or a reference cycle, because both produce CSS that silently fails to render. Run Check Theme in Settings to see the details.

```vue
import { definePreset } from '@openvue/themes';
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

export default MyTheme;
```

## Migration Assistant

OpenVue adds design tokens as it evolves. A theme created against an earlier release is missing those tokens, which leaves the affected components falling back to unset values. The migration assistant in the Settings tab compares your theme against the current version of its base preset and reports what is missing. Check for Updates lists the missing token paths without changing anything. Migrate then adds them, using the base preset's value for each. It only ever adds: a token you have already customised is never overwritten, so migrating is safe to run at any time and does nothing on a theme that is already current. Newly added tokens carry the base theme's values, which may not suit your design. After migrating, visit the relevant sections and adjust them. Exporting a copy first is still a reasonable habit, and unlike the hosted tools this comparison runs entirely in your browser.

## Overview

The Theme Designer is a visual editor for the OpenVue theming API. Pick a built-in preset as a foundation, edit primitive, semantic and per-component design tokens, watch the entire documentation site restyle as you type, then export the result as a preset file you can drop into your application. It is part of OpenVue and licensed MIT, like the rest of the library. There is no account, no license key, no theme limit and no paid tier. Open it from the icon in the top bar on any page. The designer edits a preset , the same object you would otherwise hand-write and pass to definePreset . Nothing it produces is designer-specific: an exported theme is ordinary source code with no runtime dependency on this tool.

## Privacy and Storage

The designer makes no network requests. Themes are stored in this browser's local storage under the openvue-designer key, and every export, share link and migration is computed on your machine. Nothing is uploaded, and there is no server that could receive it. The practical consequence is that your themes are tied to this browser on this device. Clearing site data removes them. Export a theme as JSON to keep a durable copy, move it to another machine, or commit it alongside your project. Local storage is finite. If it fills up, or if the browser blocks it in a private window, the designer keeps working for the current session and tells you that changes are not being persisted — export your work when you see that warning. Imported files and share links are treated as untrusted input: they are size-limited, checked for a valid schema version, rejected if they contain unsafe object keys, and never executed. A downloaded preset is inert source code that you review like any other dependency.

