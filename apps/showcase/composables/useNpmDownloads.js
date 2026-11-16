/**
 * Monthly npm downloads of the `openvue` package, for the homepage stats.
 *
 * Works like useGitHubStars: one fetch per page load, cached in sessionStorage for the tab,
 * started after hydration so the server markup and the first client render agree. Any failure
 * leaves the count null and the stat renders without a number.
 */
const PACKAGE = 'openvue';
const CACHE_KEY = 'openvue:downloads';
const CACHE_TTL = 60 * 60 * 1000;

const downloads = ref(null);
let requested = false;

function readCache() {
    try {
        const raw = sessionStorage.getItem(CACHE_KEY);

        if (!raw) return null;

        const { count, at } = JSON.parse(raw);

        return Date.now() - at < CACHE_TTL ? count : null;
    } catch {
        return null;
    }
}

function writeCache(count) {
    try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ count, at: Date.now() }));
    } catch {
        /* private mode or a full quota is not worth reporting */
    }
}

async function load() {
    const cached = readCache();

    if (cached != null) {
        downloads.value = cached;

        return;
    }

    try {
        const response = await fetch(`https://api.npmjs.org/downloads/point/last-month/${PACKAGE}`);

        if (!response.ok) return;

        const { downloads: count } = await response.json();

        if (typeof count !== 'number') return;

        downloads.value = count;
        writeCache(count);
    } catch {
        /* offline or rate limited: the stat stays empty */
    }
}

export function useNpmDownloads() {
    if (import.meta.client && !requested) {
        requested = true;
        useNuxtApp().hooks.hookOnce('app:suspense:resolve', load);
    }

    /* 40787 reads as 40.8K. */
    const downloadsLabel = computed(() => (downloads.value == null ? null : new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(downloads.value)));

    return { downloads, downloadsLabel };
}
