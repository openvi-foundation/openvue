<template>
    <section class="landing-features py-20 px-8 lg:px-20">
        <div class="features-container">
            <div class="features-header">
                <h2 class="features-title">Everything an application needs</h2>
                <p class="features-detail">Components, theming, forms and tooling, built to work together and released under one MIT license.</p>
            </div>
            <div class="features-grid">
                <OpenVueNuxtLink v-for="feature of features" :key="feature.title" :to="feature.to" :target="feature.external ? '_blank' : undefined" class="feature">
                    <div class="feature-head">
                        <i :class="['pi', feature.icon, 'feature-icon']" aria-hidden="true"></i>
                        <i :class="['pi', feature.external ? 'pi-arrow-up-right' : 'pi-arrow-right', 'feature-arrow']" aria-hidden="true"></i>
                    </div>
                    <h3 class="feature-title">{{ feature.title }}</h3>
                    <p class="feature-text">
                        <span class="feature-text-full">{{ feature.text }}</span>
                        <span class="feature-text-short">{{ feature.short }}</span>
                    </p>
                </OpenVueNuxtLink>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            features: [
                { icon: 'pi-th-large', title: '80+ components', short: 'Inputs, tables, overlays and menus.', text: 'Inputs, data tables, trees, overlays, menus and charts, built and tested together.', to: '/components' },
                { icon: 'pi-palette', title: 'Styled or unstyled', short: 'Five presets or your own CSS.', text: 'Start from one of five presets and adjust design tokens, or turn styles off and bring your own.', to: '/theming/styled' },
                { icon: 'pi-sliders-h', title: 'Pass-through', short: 'Style any element inside.', text: 'Reach any element inside a component to add classes or attributes, without forking it.', to: '/passthrough' },
                { icon: 'pi-check-square', title: 'Forms', short: 'Zod, Yup and Valibot validation.', text: 'Validation with Zod, Yup, Valibot or your own resolver, wired into every input.', to: '/forms' },
                { icon: 'pi-eye', title: 'Accessibility', short: 'Keyboard and ARIA built in.', text: 'Keyboard navigation, focus management and ARIA attributes, designed around the WCAG guidelines.', to: '/guides/accessibility' },
                { icon: 'pi-bolt', title: 'Nuxt module', short: 'Auto-imports and SSR.', text: 'Auto-imports components and directives, with server-side rendering out of the box.', to: '/nuxt' },
                { icon: 'pi-code', title: 'TypeScript', short: 'Typed props, events and slots.', text: 'Typed props, events, slots and pass-through options for every component.', to: '/setup' },
                { icon: 'pi-heart', title: 'MIT licensed', short: 'No paid tier or locked features.', text: 'No paid tier and no locked features. Developed in the open on GitHub.', to: 'https://github.com/openvi-foundation/openvue', external: true }
            ]
        };
    }
};
</script>
