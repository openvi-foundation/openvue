// Inlined into <head> by nuxt.config.js, so it must stay free of imports.
export const SITE_THEME_KEY = 'openvue-site-theme';
export const BOOT_STYLE_ID = 'openvue-site-theme-boot';
export const FONT_LINK_ID = 'openvue-site-theme-font';

export const BOOT_SCRIPT = `(function () {
    try {
        var designer = JSON.parse(localStorage.getItem('openvue-designer') || 'null');
        if (designer && designer.activeId) return;
        var theme = JSON.parse(localStorage.getItem('${SITE_THEME_KEY}') || 'null');
        if (!theme || typeof theme.css !== 'string') return;
        var style = document.createElement('style');
        style.id = '${BOOT_STYLE_ID}';
        style.textContent = theme.css;
        document.head.appendChild(style);
        if (typeof theme.font === 'string' && theme.font.indexOf('https://fonts.googleapis.com/') === 0) {
            var link = document.createElement('link');
            link.id = '${FONT_LINK_ID}';
            link.rel = 'stylesheet';
            link.href = theme.font;
            document.head.appendChild(link);
        }
    } catch (error) {}
})();`;
