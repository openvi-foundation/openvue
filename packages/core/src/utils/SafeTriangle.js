const HISTORY_SIZE = 10;

// how far back the apex has to be, so 1px steps from high polling rate mice don't misreport the direction
const MIN_APEX_DISTANCE = 8;

/**
 * Keeps an open submenu active while the pointer travels diagonally towards it across sibling items.
 * The safe area is the convex hull of the point where the pointer left the active item and the submenu rect.
 * See https://bjk5.com/post/44698559168/breaking-down-amazons-mega-dropdown
 */
export default class SafeTriangle {
    constructor(delay = 300) {
        this.delay = delay;
        this.points = [];
        this.pending = null;
        this.timeout = null;
        this.listener = null;
    }

    bind() {
        if (!this.listener) {
            this.listener = (event) => {
                // touch and pen have no hover intent to protect
                if (event.pointerType !== 'mouse') return;

                this.track({ x: event.clientX, y: event.clientY });
                this.pending && this.update();
            };

            document.addEventListener('pointermove', this.listener);
        }
    }

    unbind() {
        this.cancel();

        if (this.listener) {
            document.removeEventListener('pointermove', this.listener);
            this.listener = null;
        }

        this.points = [];
    }

    /**
     * Returns true when the pointer at `event` is heading towards `target`. The `callback` is then
     * postponed until the pointer leaves the safe area or rests, and dropped if it reaches `target`.
     */
    defer(event, target, callback) {
        const point = { x: event.clientX, y: event.clientY };
        const apex = this.pending ? this.pending.apex : this.findApex(point);

        this.track(point);

        if (!target || !apex || !isInsideSafeArea(apex, target.getBoundingClientRect(), point)) {
            this.cancel();

            return false;
        }

        this.pending = { apex, target, element: event.currentTarget, callback };
        this.schedule();

        return true;
    }

    isPending() {
        return !!this.pending;
    }

    cancel() {
        clearTimeout(this.timeout);
        this.timeout = null;
        this.pending = null;
    }

    track(point) {
        const last = this.points[this.points.length - 1];

        if (!last || last.x !== point.x || last.y !== point.y) {
            this.points.push(point);
            this.points.length > HISTORY_SIZE && this.points.shift();
        }
    }

    findApex(point) {
        let apex = null;

        for (let i = this.points.length - 1; i >= 0; i--) {
            const p = this.points[i];

            if (p.x === point.x && p.y === point.y) continue;

            apex = p;

            if (Math.hypot(p.x - point.x, p.y - point.y) >= MIN_APEX_DISTANCE) break;
        }

        return apex;
    }

    update() {
        const point = this.points[this.points.length - 1];
        const rect = this.pending.target.getBoundingClientRect();

        if (isInsideRect(rect, point)) {
            this.cancel();
        } else if (!isInsideSafeArea(this.pending.apex, rect, point)) {
            this.flush();
        } else {
            this.schedule();
        }
    }

    schedule() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.flush(), this.delay);
    }

    flush() {
        const { element, callback } = this.pending;
        const point = this.points[this.points.length - 1];

        this.cancel();

        // the pointer may have left the item that asked to be activated
        if (element && point && isInsideRect(element.getBoundingClientRect(), point)) {
            callback();
        }
    }
}

function isInsideRect(rect, { x, y }) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function cross(a, b, p) {
    return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
}

function isInsideTriangle(a, b, c, p) {
    const d = [cross(a, b, p), cross(b, c, p), cross(c, a, p)];

    return !(d.some((v) => v < 0) && d.some((v) => v > 0));
}

function isInsideSafeArea(apex, rect, point) {
    const corners = [
        { x: rect.left, y: rect.top },
        { x: rect.right, y: rect.top },
        { x: rect.right, y: rect.bottom },
        { x: rect.left, y: rect.bottom }
    ];

    return isInsideRect(rect, point) || corners.some((corner, i) => isInsideTriangle(apex, corner, corners[(i + 1) % 4], point));
}
