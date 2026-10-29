import Aura from '@openvue/themes/aura';

const loaded = { Aura };

const loaders = {
    Lara: () => import('@openvue/themes/lara'),
    Material: () => import('@openvue/themes/material'),
    Nora: () => import('@openvue/themes/nora'),
    Nide: () => import('@openvue/themes/nide')
};

export async function loadBase(name) {
    if (!loaded[name] && loaders[name]) {
        loaded[name] = (await loaders[name]()).default;
    }

    return loaded[name] || Aura;
}

export function loadedBase(name) {
    return loaded[name];
}
