# Contributing to OpenVue

Thanks for considering a contribution. OpenVue is maintained by a small team of volunteers, and community contributions are what keep this project moving.

## Before you start

- Search existing [issues](https://github.com/openvi-foundation/openvue/issues) and [discussions](https://github.com/openvi-foundation/openvue/discussions) to check your bug or idea hasn't already been reported or proposed.
- For anything beyond a small fix, open an issue first so we can discuss the approach before you put time into a PR.
- Questions and support requests belong in Discussions, not in an issue ticket.

## Reporting a bug

Use the **Bug report** issue template. It asks for a minimal reproducer (StackBlitz or CodeSandbox both work) and your environment details. Reports without a reproducer take much longer to triage and may sit longer as a result.

## Proposing a feature

Use the **Feature request** issue template. Describe the problem you're running into before jumping to a solution, it helps us evaluate whether the fix belongs in the component itself, in userland, or not at all.

## Development setup

This is a pnpm monorepo.

```bash
git clone https://github.com/openvi-foundation/openvue.git
cd openvue
pnpm run init      
pnpm run dev        
```

Useful commands while working on a component:

```bash
pnpm run lint                                                  
pnpm run format                                                 
pnpm --filter primevue exec vitest run src/button               
pnpm --filter primevue exec vitest run src/button/Button.spec.js  
```

## Submitting a pull request

1. Fork the repository.
2. Create a branch off `master` (`git checkout -b feature/your-feature-name`).
3. Make your change, and add or update tests for it.
4. Run `pnpm run lint` and `pnpm run format` before committing.
5. Reference the related issue in your PR description.
6. Open the PR against `master`.

Small, focused PRs are easier to review and get merged faster than large ones that touch many components at once.

## Code style

Formatting is enforced by Prettier and ESLint (`pnpm run format:check`, `pnpm run lint`). Match the existing patterns in a component directory rather than introducing a new style, most components follow the same `Component.vue` / `BaseComponent.vue` / `style/ComponentStyle.js` structure.
