# Consumer contract fixtures

These directories are intentionally pre-migration PrimeVue applications. The test runner copies each fixture to a temporary directory, verifies its PrimeVue baseline, migrates the copy, and installs locally packed OpenVue packages. Never install dependencies or run migration in these source fixtures.

The six fixtures cover manual Vite imports, Vite auto-imports, Nuxt SSR, Laravel with Blade and Vite, Laravel with Inertia, and Volt with Tailwind CSS 4. Their package managers and PrimeVue 4 ranges are deliberately varied to exercise version inference and lockfile handling.

Run the complete contract suite from the repository root:

```sh
pnpm test:contracts
pnpm test:consumers
pnpm test:consumers:browser
```

Use `OPENVUE_TEST_ARTIFACTS` to reuse a previously packed artifact directory. The runner rejects workspace links and remote OpenVue resolutions so local monorepo state cannot hide publishing defects.
