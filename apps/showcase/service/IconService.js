let icons = [];
let selectedIcon = null;

export const IconService = {
    getIcons() {
        return fetch('/demo/data/openicons.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => {
                icons = d.icons;

                return icons;
            });
    },

    getIcon(name) {
        if (icons) {
            selectedIcon = icons.find((x) => x.name === name);

            return selectedIcon;
        }
    }
};
