/**
 * Central SEO helper for the showcase.
 *
 * Every indexable page calls this so that title, description, canonical URL and the
 * social cards are derived from one place instead of inheriting the global homepage
 * tags declared in nuxt.config.js.
 */
const SITE_URL = 'https://openvue.dev';
const SITE_NAME = 'OpenVue';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_DESCRIPTION = 'OpenVue is the MIT-licensed continuation of PrimeVue: 80+ accessible, themeable UI components for Vue 3 and Nuxt, with the same API you already know.';

/* Canonical URLs are absolute, lower-cased and never carry a trailing slash (except the root). */
function absoluteUrl(path) {
    const clean = String(path || '/')
        .split('#')[0]
        .split('?')[0]
        .toLowerCase();
    const trimmed = clean.length > 1 ? clean.replace(/\/+$/, '') : '/';

    return `${SITE_URL}${trimmed}`;
}

/* Titles carry the brand so OpenVue is recognisable in a result list, but pages that already
   name the brand themselves are left alone rather than repeating it. */
function brandedTitle(title) {
    if (!title) return `${SITE_NAME} - Vue UI Component Library`;

    return title.toLowerCase().includes(SITE_NAME.toLowerCase()) ? title : `${title} | ${SITE_NAME}`;
}

export function useSeo(options = {}) {
    const route = useRoute();
    const { title, description = DEFAULT_DESCRIPTION, path, image = DEFAULT_IMAGE, type = 'website', keywords, jsonLd, noindex = false } = options;

    const url = absoluteUrl(path ?? route.path);
    const fullTitle = brandedTitle(title);

    useSeoMeta({
        title: fullTitle,
        description,
        ogTitle: fullTitle,
        ogDescription: description,
        ogUrl: url,
        ogType: type,
        ogSiteName: SITE_NAME,
        ogImage: image,
        ogImageAlt: fullTitle,
        twitterCard: 'summary_large_image',
        twitterTitle: fullTitle,
        twitterDescription: description,
        twitterImage: image,
        ...(keywords ? { keywords } : {}),
        ...(noindex ? { robots: 'noindex,follow' } : {})
    });

    useHead({
        link: [{ rel: 'canonical', href: url }],
        ...(jsonLd
            ? {
                  script: [
                      {
                          type: 'application/ld+json',
                          innerHTML: JSON.stringify(jsonLd)
                      }
                  ]
              }
            : {})
    });

    return { url, fullTitle };
}

export { SITE_URL, SITE_NAME, DEFAULT_IMAGE, DEFAULT_DESCRIPTION, absoluteUrl };
