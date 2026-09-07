/**
 * Shared GitHub star count for the repo badges in the topbar, hero and footer CTA.
 *
 * The count is fetched once per page load and shared through a module level ref, so the
 * three badges never hit the API separately. GitHub allows 60 unauthenticated calls an
 * hour per IP, so the answer is also cached in sessionStorage for the tab. Any failure
 * leaves the count null and the badges simply render without a number.
 *
 * The fetch waits for `app:suspense:resolve` because the sessionStorage hit resolves
 * synchronously: filling the count any earlier would make the badges render on the client
 * during hydration while the server markup has none of them.
 */
const REPO = 'openvi-foundation/openvue';
const CACHE_KEY = 'openvue:stars';
const CACHE_TTL = 60 * 60 * 1000;

const stars = ref(null);
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
        stars.value = cached;

        return;
    }

    try {
        const response = await fetch(`https://api.github.com/repos/${REPO}`);

        if (!response.ok) return;

        const { stargazers_count: count } = await response.json();

        if (typeof count !== 'number') return;

        stars.value = count;
        writeCache(count);
    } catch {
        /* offline or rate limited: the badges stay countless */
    }
}

export function useGitHubStars() {
    if (import.meta.client && !requested) {
        requested = true;
        useNuxtApp().hooks.hookOnce('app:suspense:resolve', load);
    }

    /* Locale-aware grouping keeps 1,247 readable without pulling in a formatter. */
    const starsLabel = computed(() => (stars.value == null ? null : stars.value.toLocaleString('en-US')));

    return { stars, starsLabel };
}
