/*
 * Turns the props a playground is currently applying into the tag it would take to write them by
 * hand. Only the tag is generic: the surrounding single file component depends on what the
 * component needs to work at all, so each schema supplies that through `snippet.build`.
 */

const INLINE_WIDTH = 110;

/** Formats one prop as a template attribute, static where it can be and bound where it must be. */
function attribute(name, value) {
    if (value === true) return name;
    if (typeof value === 'string') return `${name}="${value}"`;

    return `:${name}="${value}"`;
}

/**
 * Renders the component tag, breaking onto one attribute per line once it stops being readable.
 * `bindings` are the attributes the component always carries — v-model, data, handlers — and come
 * first, before the props under the visitor's control.
 */
export function buildTag({ component, props, bindings = [], indent = 0, children }) {
    const attributes = [...bindings, ...Object.entries(props).map(([name, value]) => attribute(name, value))];
    const pad = ' '.repeat(indent);

    if (!children) {
        if (!attributes.length) return `<${component} />`;

        const inline = `<${component} ${attributes.join(' ')} />`;

        if (inline.length + indent <= INLINE_WIDTH) return inline;

        return `<${component}\n${attributes.map((item) => `${pad}    ${item}`).join('\n')}\n${pad}/>`;
    }

    const body = indented(children, indent + 4);
    const open = attributes.length ? `<${component} ${attributes.join(' ')}>` : `<${component}>`;

    // only the opening tag decides the layout: children always sit on their own lines regardless
    if (open.length + indent <= INLINE_WIDTH) return `${open}\n${body}\n${pad}</${component}>`;

    return `<${component}\n${attributes.map((item) => `${pad}    ${item}`).join('\n')}\n${pad}>\n${body}\n${pad}</${component}>`;
}

/** Shifts a block of markup to the column it sits at, leaving blank lines blank. */
function indented(markup, indent) {
    const pad = ' '.repeat(indent);

    return markup
        .split('\n')
        .map((line) => (line.trim() ? `${pad}${line}` : line))
        .join('\n');
}

/**
 * The `{ basic, options, composition }` shape DocSectionCode expects. `basic` is the tag on its
 * own; the two full variants come from the schema, which is handed the tag already indented to the
 * column it sits at inside a template.
 *
 * `child` is the state of the controls that shape the markup. It reaches `snippet.children`, which
 * is a plain string for a component whose contents never change and a function of that state for
 * one where they do, and `snippet.build`, so a schema can also place markup around the tag.
 */
export function buildCode({ schema, props, child = {} }) {
    const { component, snippet } = schema;
    const bindings = snippet?.bindings ?? [];
    const children = typeof snippet?.children === 'function' ? snippet.children(child) : snippet?.children;

    const code = {
        basic: buildTag({ component, props, bindings, children }),
        ...snippet.build({
            tag: buildTag({ component, props, bindings, indent: 8, children }),
            props,
            child
        })
    };

    return Object.fromEntries(Object.entries(code).map(([key, value]) => [key, typeof value === 'string' ? blankLined(value) : value]));
}

/*
 * Every hand-written snippet on the site is a template literal that opens and closes on its own
 * line, and the blank line that leaves at each end is the only vertical padding a code block gets —
 * `pre[class*="language-"] code` sets `padding: 0 1rem`. Generated code has to say the same thing
 * itself or it renders as a bare strip of text.
 */
function blankLined(code) {
    return `\n${code}\n`;
}
