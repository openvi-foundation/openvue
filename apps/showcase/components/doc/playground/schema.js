/*
 * A playground schema names the props a component exposes as controls. Everything a control needs
 * beyond that name — its label, its description, its kind and its default — is read from the
 * generated API documentation, so the panel follows the typings instead of a second hand-kept copy
 * of them.
 */

import APIDocs from '@/doc/common/apidoc/index.json';

/** Union members are wrapped in this helper by the typings, e.g. HintedString<"blank" | "current">. */
const HINTED = /HintedString<([^>]*)>/;

/** `Nullable<T>` says a prop may be left out, which every control already allows. */
const NULLABLE = /^Nullable<(.+)>$/;

/** A quoted member of a union, e.g. the `"vertical"` in `"horizontal" | "vertical"`. */
const LITERAL = /^["'](.*)["']$/;

/** The typings write a prop that accepts the string form of a value as its own alias. */
const ALIASED = { Booleanish: 'boolean', Numberish: 'number' };

/** The typings spell an absent default several ways; all of them mean "the component decides". */
const UNSET = ['', 'null', 'undefined'];

/*
 * A union counts as text as long as one member is a string and the rest are things a typed value
 * stands in for: `string | Function` is a property name or a getter, `string | object` is a class
 * string or a class object, `string | number` is either written the same way.
 */
const TEXTISH = ['string', 'Function', 'object', 'number', 'null', 'undefined'];

const titleCase = (name) => name.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());

/** Reads the props of `<Component>Props` out of the apidoc bundle, keyed by prop name. */
function readProps(component) {
    const module = APIDocs[component.toLowerCase()];
    const props = module?.interfaces?.values?.[`${component}Props`]?.props;

    return new Map((props ?? []).map((prop) => [prop.name, prop]));
}

/**
 * Maps an apidoc type string onto a control kind. Returns null only for types with nothing a
 * control could produce — `any`, a bare `object`, `Record<string, any>`, `PassThrough<...>` — which
 * a schema must then handle itself or leave out.
 */
function inferControl(type) {
    const nullable = NULLABLE.exec(type);

    if (nullable) return inferControl(nullable[1]);

    if (type === 'boolean' || ALIASED[type] === 'boolean') return { control: 'boolean' };
    if (type === 'number' || ALIASED[type] === 'number') return { control: 'number' };

    const hinted = HINTED.exec(type);

    if (hinted) return { control: 'select', options: literals(hinted[1]) };

    const members = type
        .split('|')
        .map((member) => member.trim())
        // an optional prop is documented as a union with its own absence, which says nothing about the control
        .filter((member) => member !== 'null' && member !== 'undefined');

    /*
     * A union of nothing but quoted members is a closed set the same way a hinted one is. The
     * typings only reach for HintedString when the prop also takes strings outside the set.
     */
    if (members.length > 1 && members.every((member) => LITERAL.test(member))) return { control: 'select', options: literals(type) };

    if (members.includes('string') && members.every((member) => TEXTISH.includes(member))) return { control: 'text' };

    return null;
}

/** The members of a union, unquoted, in the order the typings list them. */
function literals(union) {
    return union
        .split('|')
        .map((member) => member.trim().replace(/^["']|["']$/g, ''))
        .filter((member) => member && member !== 'null' && member !== 'undefined');
}

/**
 * Turns the documented default — always a string — back into the value the control binds to.
 * Each kind has its own idea of "unset" because the underlying inputs disagree about it: a switch
 * needs a boolean, a text field needs a string, and a select clears to null.
 */
function parseDefault(raw, control) {
    const unset = raw == null || UNSET.includes(raw);

    if (control === 'boolean') return raw === 'true';
    if (control === 'number') return unset ? null : Number(raw);
    // some defaults are written as source literals, e.g. '{0} results are available'
    if (control === 'text') return unset ? '' : raw.replace(/^'(.*)'$/s, '$1');

    return unset ? null : raw;
}

/**
 * Builds a schema from a list of groups, each `{ title, controls: [...] }`. A control is a prop
 * name, or an object carrying overrides: `control`, `options`, `label`, `min`, `max`, `step`,
 * `when(state)` for a prop that only applies while another is set, and `seed` for the value the
 * playground should open on.
 *
 * A seed is for a prop the component needs a value for before it is worth looking at — a Button
 * with no label is an empty box. It is the starting state and what reset returns to, but it is not
 * the component's own default, so it appears in the generated code the way a hand-written example
 * would spell it out.
 */
export function defineSchema({ component, groups, snippet }) {
    const documented = readProps(component);
    const defaults = {};
    /*
     * Kept on the schema as well as logged, because the apidoc is regenerated from the typings and a
     * prop can be renamed or retyped out from under a schema written months earlier. The test in
     * playgrounds.spec.js reads these, so that drift fails a run instead of quietly dropping a control.
     */
    const warnings = [];

    const warn = (message) => {
        warnings.push(message);
        console.warn(`[playground] ${message}`);
    };

    const resolved = groups.map((group) => ({
        title: group.title,
        controls: group.controls
            .map((entry) => {
                const control = typeof entry === 'string' ? { prop: entry } : { ...entry };
                const meta = documented.get(control.prop);

                if (!meta) {
                    warn(`${component} has no documented prop "${control.prop}"`);

                    return null;
                }

                const inferred = control.control ? { control: control.control, options: control.options } : inferControl(meta.type);

                if (!inferred) {
                    warn(`${component}.${control.prop} is typed "${meta.type}", which needs an explicit control`);

                    return null;
                }

                const merged = {
                    ...control,
                    ...inferred,
                    label: control.label ?? titleCase(control.prop),
                    description: meta.description,
                    default: parseDefault(meta.default, inferred.control)
                };

                // `default` stays what the component does on its own, which is what decides whether a value is worth writing down
                defaults[merged.prop] = merged.seed !== undefined ? merged.seed : merged.default;

                return merged;
            })
            .filter(Boolean)
    }));

    return { component, groups: resolved, defaults, snippet, warnings };
}

/** A fresh copy of the defaults, for initial state and for the reset button. */
export function createState(schema) {
    return { ...schema.defaults };
}

/**
 * Whether a control currently contributes a property: it applies at all, and its value says
 * something the component's own default does not.
 */
export function isActive(control, state) {
    if (control.when && !control.when(state)) return false;

    const value = state[control.prop];

    return value !== control.default && value != null && value !== '';
}

/**
 * The props worth writing down: those the visitor changed away from the component's own default.
 * Codegen serializes these, so the generated snippet stays as short as the equivalent hand-written
 * one, and binding them onto the preview leaves untouched props at their real defaults.
 *
 * A control the rail is hiding is skipped even when its value lingers in state, so turning off the
 * property that revealed it also drops it from the preview and the generated code.
 */
export function activeProps(schema, state) {
    const active = {};

    for (const group of schema.groups) {
        for (const control of group.controls) {
            if (isActive(control, state)) active[control.prop] = state[control.prop];
        }
    }

    return active;
}
