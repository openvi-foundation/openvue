/**
 * Keeps track of the open overlays (panels a component renders, usually attached to body) and the element of the
 * component that owns each one. A component uses it to tell whether a click landed inside its panel or inside the
 * overlay of another component placed in its panel, at any depth (e.g. the options of a Select in the footer of a
 * TreeSelect), and whether such a nested overlay is still open.
 *
 * Overlays are registered when they start to show and unregistered when they start to hide. A nested overlay may
 * close between `mousedown` and `click` (Select picks an option on `mousedown`), so the last `mousedown` is resolved
 * while everything is still registered, and a following mouse `click` counts as inside if that press was inside.
 */
const overlays = new Map(); // overlay element -> owner node
let press = null; // { event, nodes, overlays } of the last mousedown

const getTarget = (event) => (event.composedPath ? event.composedPath()[0] : null) || event.target;

// Walks from the node to the owner of the innermost overlay that contains it, then on from that owner.
const resolve = (target) => {
    const nodes = [];
    const containing = new Set();
    let node = target;

    while (node && !nodes.includes(node)) {
        nodes.push(node);

        let innermost = null;

        overlays.forEach((_, overlay) => {
            if (overlay.contains(node)) {
                containing.add(overlay);

                if (!innermost || innermost.contains(overlay)) {
                    innermost = overlay;
                }
            }
        });

        node = innermost ? overlays.get(innermost) : null;
    }

    return { nodes, overlays: containing };
};

// `overlays` catches nodes that were removed from the DOM after they were resolved.
const isIn = (resolved, container) => resolved.overlays.has(container) || resolved.nodes.some((node) => container.contains(node));

// An overlay that was removed from the page without being unregistered must not keep a parent open.
const prune = () => overlays.forEach((_, overlay) => !overlay.isConnected && overlays.delete(overlay));

// Bound once and kept, so the press of a mouse click is always the current one.
let bound = false;

const onMouseDown = (event) => {
    press = overlays.size ? { event, ...resolve(getTarget(event)) } : null;
};

const OverlayRegistry = {
    register(overlay, owner) {
        if (!overlay || !owner || typeof window === 'undefined') return;

        if (!bound) {
            window.addEventListener('mousedown', onMouseDown, true);
            bound = true;
        }

        overlays.set(overlay, owner);
    },
    unregister(overlay) {
        overlays.delete(overlay);
    },
    isInside(event, container) {
        if (!event || !container) return false;

        if (isIn(resolve(getTarget(event)), container)) return true;

        // a keyboard click (detail 0) has no press of its own
        const pressed = press && (press.event === event || (event.type === 'click' && event.detail > 0));

        return !!pressed && isIn(press, container);
    },
    hasNestedOverlay(container) {
        if (!container) return false;

        prune();

        for (const [overlay, owner] of overlays) {
            if (overlay !== container && isIn(resolve(owner), container)) return true;
        }

        return false;
    }
};

export default OverlayRegistry;
