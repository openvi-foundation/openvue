# Introduction

The Vue UI component library, continued.

## Accessibility

OpenVue has WCAG 2.1 AA level compliance, and each component has a dedicated accessibility section documenting keyboard and screen reader support. Accessibility regressions are treated as bugs, so please report anything you run into. View the accessibility guide to learn more.

## Migrating from PrimeVue

An existing PrimeVue v4 project moves over with a single command, no manual find and replace required. The tool shows you a plan first, covering the detected package manager, the PrimeVue version and every file it intends to touch, then asks before writing anything. It renames dependencies, rewrites imports and leaves a single reviewable diff. Run it with --dry for a preview that writes nothing, and see the migration guide for the full walkthrough.

```vue
npx @openvue/migrate
```

## Overview

OpenVue is a complete UI suite for Vue.js, consisting of a rich set of components that are easy to tune and customize as an in-house library. The library is a community-maintained continuation of PrimeVue, picked up after it was archived by its original maintainers. Everything you know from PrimeVue v4 is here, under a name and a maintenance path that are not tied to a single company. OpenVue is not affiliated with PrimeTek or PrimeUI. Development is led by Openvi Foundation , an independent organization of developers who run this library in production. Every component is MIT licensed, with no paid tier and nothing held back.

## Pass Through

Pass Through is an API that provides access to the internal DOM elements of a component to add arbitrary attributes. Traditional UI component libraries encapsulate their markup behind limited APIs, which leaves you waiting on a maintainer to add the prop or event you need. With Pass Through that limitation is gone, since you can reach the internals of a component yourself. Common use cases are test attributes, additional aria attributes, custom events and styling.

## Theming

OpenVue can be styled in two modes, styled or unstyled. Styled mode is based on pre-skinned components with opinionated theme variants such as the Aura, Lara, Material and Nora presets, all driven by design tokens rather than hardcoded CSS. Unstyled mode leaves the styling to you while keeping the functionality and accessibility intact, through a pluggable architecture that works with CSS libraries like Tailwind CSS, Bootstrap and Bulma, or with your own custom CSS. This design is future proof, as OpenVue can be styled with any CSS library without depending on one in its core.

