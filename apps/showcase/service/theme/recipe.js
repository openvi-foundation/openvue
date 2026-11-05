import { BASES, DENSITIES, DISABLED_MAX, DISABLED_MIN, FOCUS_RINGS, FONTS, MASKS, MOTIONS, PRIMARY_COLORS, SHADOWS, SURFACES, isCustomColor, isFontFamily } from './compile';

export const SURFACE_OPTIONS = ['default', ...Object.keys(SURFACES)];

export const SCALES = [12, 13, 14, 15, 16];

export const RADIUS_MIN = 0;
export const RADIUS_MAX = 16;

export const INPUT_VARIANTS = ['outlined', 'filled'];

export const FOCUS_OPTIONS = ['default', ...Object.keys(FOCUS_RINGS)];
export const MOTION_OPTIONS = ['default', ...Object.keys(MOTIONS)];
export const SHADOW_OPTIONS = ['default', ...Object.keys(SHADOWS)];
export const MASK_OPTIONS = ['default', ...Object.keys(MASKS)];

export const DEFAULT_RECIPE = Object.freeze({
    base: 'Aura',
    primary: 'noir',
    surface: 'default',
    font: 'Inter var',
    radius: null,
    scale: 14,
    density: 'default',
    input: 'outlined',
    focus: 'default',
    motion: 'default',
    ripple: false,
    shadow: 'default',
    mask: 'default',
    disabled: null
});

export const PRESETS = [
    {
        name: 'Shoji',
        description: 'The OpenVue documentation look: crisp, neutral and ink-black.',
        ...DEFAULT_RECIPE
    },
    {
        name: 'Loft',
        description: 'Black, white and nothing extra. Borders over shadows.',
        ...DEFAULT_RECIPE,
        base: 'Nide',
        surface: 'neutral',
        font: 'Geist',
        motion: 'fast',
        shadow: 'flat'
    },
    {
        name: 'Pavilion',
        description: 'Deep indigo and tight rows for finance and analytics.',
        ...DEFAULT_RECIPE,
        base: 'Nora',
        primary: '#3730a3',
        surface: 'slate',
        font: 'IBM Plex Sans',
        radius: 2,
        scale: 13,
        density: 'compact',
        focus: 'tight',
        shadow: 'soft',
        mask: 'dark'
    },
    {
        name: 'Veranda',
        description: 'Steady blue, larger text and bold focus rings for public services.',
        ...DEFAULT_RECIPE,
        base: 'Lara',
        primary: '#0369a1',
        surface: 'gray',
        font: 'Figtree',
        radius: 10,
        scale: 15,
        density: 'roomy',
        focus: 'bold',
        shadow: 'soft',
        mask: 'light'
    },
    {
        name: 'Pergola',
        description: 'Fresh green on warm neutrals for wellness and sustainability.',
        ...DEFAULT_RECIPE,
        base: 'Nide',
        primary: '#15803d',
        surface: 'stone',
        font: 'DM Sans',
        radius: 12,
        motion: 'slow',
        shadow: 'soft'
    },
    {
        name: 'Portico',
        description: 'Earthy orange and lifted cards for retail, food and hospitality.',
        ...DEFAULT_RECIPE,
        primary: '#c2410c',
        surface: 'stone',
        font: 'Outfit',
        radius: 12,
        focus: 'hairline',
        shadow: 'deep'
    },
    {
        name: 'Atelier',
        description: 'Saturated violet, ripples and deep shadows for creative tools.',
        ...DEFAULT_RECIPE,
        base: 'Material',
        primary: '#6d28d9',
        surface: 'zinc',
        font: 'Poppins',
        radius: 8,
        input: 'filled',
        ripple: true,
        shadow: 'deep',
        mask: 'dark'
    },
    {
        name: 'Garage',
        description: 'Square, flat and instant. A technical voice for developer tools.',
        ...DEFAULT_RECIPE,
        base: 'Nora',
        primary: '#1d4ed8',
        surface: 'slate',
        font: 'Space Grotesk',
        radius: 0,
        density: 'compact',
        focus: 'tight',
        motion: 'off',
        shadow: 'flat',
        disabled: 0.4
    },
    {
        name: 'Skylight',
        description: 'Cool cyan, airy surfaces and unhurried motion for dashboards.',
        ...DEFAULT_RECIPE,
        primary: '#0e7490',
        surface: 'ocean',
        font: 'Plus Jakarta Sans',
        radius: 10,
        motion: 'slow',
        shadow: 'soft',
        mask: 'light'
    },
    {
        name: 'Alcove',
        description: 'Warm greys, soft corners and larger text for content-first products.',
        ...DEFAULT_RECIPE,
        surface: 'stone',
        font: 'Manrope',
        radius: 10,
        scale: 15,
        density: 'roomy',
        motion: 'slow',
        shadow: 'soft',
        mask: 'light'
    },
    {
        name: 'Gazebo',
        description: 'Confident rose, round shapes and ripples for consumer apps.',
        ...DEFAULT_RECIPE,
        base: 'Lara',
        primary: '#be123c',
        surface: 'zinc',
        font: 'Nunito',
        radius: 16,
        density: 'roomy',
        focus: 'bold',
        ripple: true,
        shadow: 'deep'
    },
    {
        name: 'Terrace',
        description: 'Optimistic gold and clear focus for education and onboarding.',
        ...DEFAULT_RECIPE,
        primary: '#a16207',
        surface: 'stone',
        font: 'Rubik',
        radius: 12,
        density: 'roomy',
        focus: 'bold',
        shadow: 'deep'
    }
];

const RECIPE_KEYS = Object.keys(DEFAULT_RECIPE);

// Input comes from URLs and storage, so every field is checked and falls back to its default.
export function normalizeRecipe(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const recipe = { ...DEFAULT_RECIPE };
    const primary = typeof source.primary === 'string' ? source.primary.toLowerCase() : source.primary;
    const radius = source.radius === null || source.radius === 'default' ? null : Number(source.radius);
    const scale = Number(source.scale);
    const disabled = source.disabled === null || source.disabled === 'default' || source.disabled === undefined ? null : Math.round(Number(source.disabled) * 100) / 100;

    if (BASES.some((base) => base.value === source.base)) recipe.base = source.base;
    if (PRIMARY_COLORS.includes(primary) || isCustomColor(primary)) recipe.primary = primary;
    if (SURFACE_OPTIONS.includes(source.surface)) recipe.surface = source.surface;
    if (FONTS.includes(source.font) || isFontFamily(source.font)) recipe.font = source.font;
    if (radius === null || (Number.isInteger(radius) && radius >= RADIUS_MIN && radius <= RADIUS_MAX)) recipe.radius = radius;
    if (SCALES.includes(scale)) recipe.scale = scale;
    if (Object.hasOwn(DENSITIES, source.density)) recipe.density = source.density;
    if (INPUT_VARIANTS.includes(source.input)) recipe.input = source.input;
    if (FOCUS_OPTIONS.includes(source.focus)) recipe.focus = source.focus;
    if (MOTION_OPTIONS.includes(source.motion)) recipe.motion = source.motion;
    if (source.ripple === true || source.ripple === 'true') recipe.ripple = true;
    if (SHADOW_OPTIONS.includes(source.shadow)) recipe.shadow = source.shadow;
    if (MASK_OPTIONS.includes(source.mask)) recipe.mask = source.mask;
    if (disabled === null || (disabled >= DISABLED_MIN && disabled <= DISABLED_MAX)) recipe.disabled = disabled;

    return recipe;
}

export function isSameRecipe(a, b) {
    return RECIPE_KEYS.every((key) => a[key] === b[key]);
}

export function findPreset(recipe) {
    return PRESETS.find((preset) => isSameRecipe(preset, recipe));
}

export function presetRecipe(preset) {
    const { name: _name, description: _description, ...recipe } = preset;

    return recipe;
}

// Writes only the base and the choices that differ from the default.
export function encodeRecipe(recipe) {
    const params = new URLSearchParams();

    for (const key of RECIPE_KEYS) {
        if (key === 'base' || recipe[key] !== DEFAULT_RECIPE[key]) {
            params.set(key, recipe[key] === null ? 'default' : String(recipe[key]));
        }
    }

    return params.toString();
}

export function decodeRecipe(hash) {
    const params = new URLSearchParams(String(hash || '').replace(/^#/, ''));

    return params.has('base') ? normalizeRecipe(Object.fromEntries(params.entries())) : null;
}

// Quick repeated edits to one setting (dragging a slider) collapse into one step.
export function createRecipeHistory({ limit = 50, coalesceMs = 600 } = {}) {
    let entries = [];
    let index = -1;
    let lastKey = null;
    let lastAt = 0;

    return {
        push(recipe, now = Date.now()) {
            const current = entries[index];

            if (current && isSameRecipe(current, recipe)) return;

            const changed = current ? RECIPE_KEYS.filter((key) => current[key] !== recipe[key]) : [];
            const key = changed.length === 1 ? changed[0] : null;

            entries = entries.slice(0, index + 1);

            if (key && key === lastKey && now - lastAt < coalesceMs && entries.length > 1) {
                entries[entries.length - 1] = { ...recipe };
            } else {
                entries.push({ ...recipe });
            }

            if (entries.length > limit) entries.shift();

            index = entries.length - 1;
            lastKey = key;
            lastAt = now;
        },
        undo() {
            if (index <= 0) return null;

            index--;
            lastKey = null;

            return { ...entries[index] };
        },
        redo() {
            if (index >= entries.length - 1) return null;

            index++;
            lastKey = null;

            return { ...entries[index] };
        },
        canUndo() {
            return index > 0;
        },
        canRedo() {
            return index < entries.length - 1;
        }
    };
}
