import { markRaw } from 'vue';

/* One SFC per component preview; the file name is the component name from the menu.
   markRaw keeps Vue from proxying the component definitions when they are read in a template. */
const modules = import.meta.glob('./*.vue', { eager: true });

const previews = {};

for (const path in modules) {
    previews[path.slice(2, -4)] = markRaw(modules[path].default);
}

export default previews;
