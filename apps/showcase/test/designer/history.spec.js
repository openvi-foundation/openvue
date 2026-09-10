import { describe, expect, it } from 'vitest';
import { createHistory } from '../../service/designer/history';

describe('designer/history', () => {
    it('starts empty', () => {
        const history = createHistory();

        expect(history.canUndo()).toBe(false);
        expect(history.canRedo()).toBe(false);
        expect(history.undo()).toBeNull();
        expect(history.redo()).toBeNull();
    });

    it('undoes and redoes a single edit', () => {
        const history = createHistory();

        history.push({ path: 'a.b', before: '1', after: '2' }, 1000);

        const undone = history.undo();

        expect(undone.before).toBe('1');
        expect(history.canUndo()).toBe(false);

        const redone = history.redo();

        expect(redone.after).toBe('2');
        expect(history.canRedo()).toBe(false);
    });

    it('coalesces same-path edits inside the window into one entry', () => {
        const history = createHistory({ coalesceMs: 400 });

        history.push({ path: 'a.b', before: '1', after: '2' }, 1000);
        history.push({ path: 'a.b', before: '2', after: '3' }, 1200);
        history.push({ path: 'a.b', before: '3', after: '4' }, 1300);

        expect(history.size()).toBe(1);

        const undone = history.undo();

        expect(undone.before).toBe('1');
        expect(undone.after).toBe('4');
    });

    it('does not coalesce past the window', () => {
        const history = createHistory({ coalesceMs: 400 });

        history.push({ path: 'a.b', before: '1', after: '2' }, 1000);
        history.push({ path: 'a.b', before: '2', after: '3' }, 2000);

        expect(history.size()).toBe(2);
    });

    it('does not coalesce edits to different paths', () => {
        const history = createHistory({ coalesceMs: 400 });

        history.push({ path: 'a.b', before: '1', after: '2' }, 1000);
        history.push({ path: 'c.d', before: 'x', after: 'y' }, 1050);

        expect(history.size()).toBe(2);
    });

    it('discards the redo branch when a new edit lands after an undo', () => {
        const history = createHistory();

        history.push({ path: 'a', before: 1, after: 2 }, 1000);
        history.push({ path: 'b', before: 3, after: 4 }, 2000);
        history.undo();
        history.push({ path: 'c', before: 5, after: 6 }, 3000);

        expect(history.canRedo()).toBe(false);
        expect(history.size()).toBe(2);
    });

    it('caps retained entries at the limit, dropping the oldest', () => {
        const history = createHistory({ limit: 3, coalesceMs: 0 });

        for (let i = 0; i < 10; i++) {
            history.push({ path: 'p' + i, before: i, after: i + 1 }, 1000 + i * 1000);
        }

        expect(history.size()).toBe(3);
        expect(history.undo().path).toBe('p9');
    });

    it('clears back to the initial state', () => {
        const history = createHistory();

        history.push({ path: 'a', before: 1, after: 2 }, 1000);
        history.clear();

        expect(history.size()).toBe(0);
        expect(history.canUndo()).toBe(false);
    });
});
