/**
 * Browser smoke test for the Theme Designer.
 *
 * Drives the built showcase in a real Chromium: opens the drawer, creates a theme, edits a token
 * and asserts the corresponding CSS variable actually changed on the live page. It also asserts
 * the designer makes no network calls, which is the load-bearing claim of the whole feature.
 *
 * Deliberately not a Playwright test suite — the repo has no Playwright runner, and this reuses
 * @playwright/test purely as a browser automation library, the same way run-consumer-tests.mjs
 * already does in CI.
 *
 * Usage: node scripts/designer-smoke.mjs   (requires `pnpm --filter showcase build` first)
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const showcase = join(root, 'apps', 'showcase');
const port = 3123;
const url = `http://127.0.0.1:${port}`;

/** Hosts served by the local preview server. */
const LOCAL_HOSTS = new Set(['127.0.0.1', 'localhost']);

/**
 * Resource types that would indicate a data call to a backend. The showcase itself pulls fonts
 * and images from third-party CDNs (a pre-existing de-branding gap, unrelated to the designer),
 * so the assertion is scoped to the claim that matters: the designer talks to no service.
 */
const DATA_RESOURCE_TYPES = new Set(['xhr', 'fetch', 'websocket', 'eventsource']);

function fail(message) {
    console.error('designer-smoke: ' + message);
    process.exitCode = 1;
    throw new Error(message);
}

async function waitForUrl(child) {
    for (let attempt = 0; attempt < 120; attempt++) {
        if (child.exitCode !== null) throw new Error(`preview server exited with ${child.exitCode}`);

        try {
            const response = await fetch(url);

            if (response.ok) return;
        } catch {}

        await new Promise((resolve) => setTimeout(resolve, 250));
    }

    throw new Error(`preview server did not become ready at ${url}`);
}

function stopPreview(child) {
    if (child.exitCode !== null || child.pid === undefined) return;

    if (process.platform === 'win32') {
        spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { shell: false, stdio: 'ignore' });
    } else {
        try {
            process.kill(-child.pid, 'SIGTERM');
        } catch {
            child.kill('SIGTERM');
        }
    }
}

if (!existsSync(join(showcase, '.output', 'server', 'index.mjs'))) {
    fail('showcase is not built — run `pnpm --filter showcase build` first');
}

// Run the built Nitro server directly rather than through `nuxt preview`: no shell, no .cmd
// resolution (which Node refuses to spawn on Windows), and one less layer to keep alive.
const child = spawn(process.execPath, [join(showcase, '.output', 'server', 'index.mjs')], {
    cwd: showcase,
    env: { ...process.env, PORT: String(port), NITRO_PORT: String(port), HOST: '127.0.0.1' },
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: process.platform !== 'win32',
    shell: false
});

child.stdout.on('data', () => {});
child.stderr.on('data', (chunk) => process.stderr.write(chunk));

let browser;

try {
    await waitForUrl(child);

    const { chromium } = await import('@playwright/test');

    browser = await chromium.launch();

    const page = await browser.newPage();
    const errors = [];
    const externalRequests = [];

    // The showcase build targets Vercel, so its analytics scripts 404 when previewed locally.
    // That is environmental noise, not a designer failure.
    const isEnvironmentalNoise = (text) => text.includes('/_vercel/');

    page.on('pageerror', (error) => {
        if (!isEnvironmentalNoise(error.message)) errors.push(error.message);
    });
    page.on('console', (message) => {
        if (message.type() === 'error' && !isEnvironmentalNoise(message.text())) errors.push(message.text());
    });
    page.on('request', (request) => {
        const host = new URL(request.url()).hostname;

        if (!LOCAL_HOSTS.has(host) && DATA_RESOURCE_TYPES.has(request.resourceType())) {
            externalRequests.push(request.resourceType() + ' ' + request.url());
        }
    });

    // A component route, so the Component token tab is live.
    await page.goto(`${url}/button`, { waitUntil: 'networkidle' });

    await page.locator('button[aria-label="Theme Designer"]').click();
    await page.getByText('My Themes').waitFor({ state: 'visible', timeout: 10000 });

    // Dashboard -> create theme
    await page.locator('.designer button i.pi-plus').click();
    await page.locator('.designer input[maxlength="25"]').fill('Smoke Theme');
    await page.locator('.designer button', { hasText: 'Create' }).click();

    // The editor opens on the Primitive tab, whose "Rounded" fieldset is expanded by default.
    await page.getByRole('tab', { name: 'Primitive' }).waitFor({ state: 'visible', timeout: 10000 });

    const variable = '--p-border-radius-md';
    const before = await page.evaluate((name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim(), variable);

    if (!before) fail(`${variable} was not present before editing`);

    // Every DesignTokenField renders an AutoComplete; the "Medium" radius is the 4th in the grid.
    const field = page.locator('.designer input[role="combobox"]:visible').nth(3);

    await field.waitFor({ state: 'visible', timeout: 10000 });

    if (await field.isDisabled()) fail('token fields are disabled — the editor is read-only');

    await field.fill('13px');
    await field.press('Enter');

    await page.waitForFunction(([name, previous]) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() !== previous, [variable, before], { timeout: 10000 });

    const after = await page.evaluate((name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim(), variable);

    if (after === before) fail(`editing a token did not change ${variable} (still ${before})`);

    // The theme must survive a reload, since persistence is the point of the local store.
    await page.reload({ waitUntil: 'networkidle' });

    const stored = await page.evaluate(() => {
        const raw = window.localStorage.getItem('openvue-designer');

        return raw ? JSON.parse(raw).themes.length : 0;
    });

    if (stored < 1) fail('the created theme was not persisted to localStorage');

    if (externalRequests.length) fail(`the designer made off-origin data requests: ${externalRequests.slice(0, 5).join(', ')}`);

    if (errors.length) fail(`console/page errors: ${errors.slice(0, 5).join(' | ')}`);

    console.log(`designer-smoke: passed — ${variable} ${before} -> ${after}, ${stored} theme persisted, no off-origin data requests`);
} finally {
    if (browser) await browser.close();
    stopPreview(child);
}
