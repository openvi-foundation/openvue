<template>
    <section class="landing-features landing-section">
        <div class="landing-container">
            <div class="landing-section-header">
                <h2 class="landing-section-title">Everything an application needs</h2>
                <p class="landing-section-detail">Components, theming, forms and tooling, built to work together and released under one MIT license.</p>
            </div>

            <div class="features-explorer">
                <div class="features-list" role="tablist" aria-orientation="vertical" aria-label="Features" @keydown="onListKeydown">
                    <button
                        v-for="(feature, index) of features"
                        :id="`feature-tab-${feature.id}`"
                        :key="feature.id"
                        ref="tabs"
                        type="button"
                        role="tab"
                        :aria-selected="active === index"
                        :aria-controls="`feature-panel-${feature.id}`"
                        :tabindex="active === index ? 0 : -1"
                        :class="['features-item', { 'is-active': active === index }]"
                        @click="select(index)"
                    >
                        <span class="features-item-title">{{ feature.title }}</span>
                        <span class="features-item-text">{{ feature.text }}</span>
                    </button>
                </div>

                <div class="features-stage">
                    <!-- Phones and tablets show the list as a row of tabs with titles only; the selected feature's sentence moves here. -->
                    <p class="features-active-text">{{ current.text }}</p>
                    <Transition name="features-swap" mode="out-in">
                        <div :id="`feature-panel-${current.id}`" :key="current.id" role="tabpanel" :aria-labelledby="`feature-tab-${current.id}`" class="features-panel">
                            <div v-if="current.id === 'components'" class="features-demo features-demo-table">
                                <DataTable :value="orders" size="small" sortField="date" :sortOrder="-1" tableStyle="min-width: 26rem">
                                    <Column field="id" header="Order" />
                                    <Column field="customer" header="Customer" sortable />
                                    <Column field="amount" header="Amount" sortable>
                                        <template #body="{ data }">{{ formatAmount(data.amount) }}</template>
                                    </Column>
                                    <Column field="status" header="Status" sortable>
                                        <template #body="{ data }">
                                            <Tag :value="data.status" :severity="statusSeverity[data.status]" />
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>

                            <div v-else-if="current.id === 'styling'" class="features-demo features-demo-styling">
                                <figure>
                                    <Button label="Save changes" icon="pi pi-check" />
                                    <figcaption>With a preset</figcaption>
                                </figure>
                                <figure>
                                    <Button label="Save changes" unstyled :pt="unstyledButton" />
                                    <figcaption>Unstyled, with your own classes</figcaption>
                                </figure>
                            </div>

                            <div v-else-if="current.id === 'a11y'" class="features-demo features-demo-a11y">
                                <Listbox v-model="city" :options="cities" optionLabel="name" ariaLabelledby="features-listbox-hint" class="w-full" />
                                <p id="features-listbox-hint" class="features-hint">Tab into the list, then use the arrow keys or type a letter to jump.</p>
                            </div>

                            <form v-else-if="current.id === 'forms'" class="features-demo features-demo-form" novalidate @submit.prevent="submitForm">
                                <div class="features-field">
                                    <label for="features-email">Work email</label>
                                    <InputText id="features-email" v-model="email" :invalid="emailInvalid" placeholder="you@company.com" fluid aria-describedby="features-email-message" />
                                    <Message id="features-email-message" :severity="emailInvalid ? 'error' : 'secondary'" size="small" variant="simple">{{ emailMessage }}</Message>
                                </div>
                                <div class="features-field">
                                    <label for="features-plan">Plan</label>
                                    <Select v-model="plan" inputId="features-plan" :options="plans" fluid />
                                </div>
                                <Button type="submit" label="Create account" />
                            </form>

                            <div v-else class="features-demo features-demo-file">
                                <div class="features-file">
                                    <div class="features-file-name">nuxt.config.ts</div>
                                    <pre><code>{{ nuxtSnippet }}</code></pre>
                                </div>
                            </div>
                        </div>
                    </Transition>

                    <OpenVueNuxtLink :to="current.to" class="features-more">
                        {{ current.more }}
                        <i class="pi pi-arrow-right" aria-hidden="true"></i>
                    </OpenVueNuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
    data() {
        return {
            active: 0,
            features: [
                { id: 'components', title: '80+ components', text: 'Inputs, data tables, trees, overlays, menus and charts, built and tested together.', to: '/components', more: 'Browse all components' },
                { id: 'styling', title: 'Styled or unstyled', text: 'Start from a preset and adjust design tokens, or turn styles off and bring your own classes.', to: '/passthrough', more: 'Read about pass-through' },
                { id: 'a11y', title: 'Accessible by default', text: 'Keyboard navigation, focus management and ARIA attributes, following the WCAG guidelines.', to: '/guides/accessibility', more: 'Read the accessibility guide' },
                { id: 'forms', title: 'Forms that validate', text: 'Zod, Yup, Valibot or your own resolver, wired into every input.', to: '/forms', more: 'Read the forms guide' },
                { id: 'nuxt', title: 'Nuxt and TypeScript', text: 'One module auto-imports every component with SSR, and every prop, event and slot is typed.', to: '/nuxt', more: 'Set up with Nuxt' }
            ],
            orders: [
                { id: '#1042', customer: 'Ana Petrović', amount: 1290, status: 'Paid', date: 5 },
                { id: '#1041', customer: 'Lukas Berg', amount: 340, status: 'Pending', date: 4 },
                { id: '#1040', customer: 'Sofia Marin', amount: 2150, status: 'Paid', date: 3 },
                { id: '#1039', customer: 'Tom Okafor', amount: 89, status: 'Refunded', date: 2 },
                { id: '#1038', customer: 'Mia Novak', amount: 760, status: 'Paid', date: 1 },
                { id: '#1037', customer: 'Jonas Weber', amount: 1480, status: 'Pending', date: 0 },
                { id: '#1036', customer: 'Lea Horvat', amount: 215, status: 'Paid', date: -1 }
            ],
            statusSeverity: { Paid: 'success', Pending: 'warn', Refunded: 'secondary' },
            unstyledButton: {
                root: 'inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer'
            },
            cities: [{ name: 'Amsterdam' }, { name: 'Belgrade' }, { name: 'Berlin' }, { name: 'Lisbon' }, { name: 'Madrid' }, { name: 'Paris' }],
            city: { name: 'Belgrade' },
            email: 'ana@openvue',
            plan: 'Team',
            plans: ['Hobby', 'Team', 'Enterprise'],
            nuxtSnippet: `export default defineNuxtConfig({\n    modules: ['@openvue/nuxt-module']\n});`
        };
    },
    computed: {
        current() {
            return this.features[this.active];
        },
        emailInvalid() {
            return this.email.length > 0 && !EMAIL.test(this.email);
        },
        emailMessage() {
            if (this.email.length === 0) return 'We only use it for release notes.';

            return this.emailInvalid ? 'Enter a full address, like ana@openvue.dev' : 'Looks good.';
        }
    },
    methods: {
        formatAmount(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(value);
        },
        /* On narrow screens the tabs scroll sideways, so the selected one is brought fully into view. */
        select(index) {
            this.active = index;
            this.$refs.tabs[index]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        },
        /* The list is vertical on desktop and a horizontal row on phones, so both arrow pairs move between features. */
        onListKeydown(event) {
            const last = this.features.length - 1;
            const forward = this.active === last ? 0 : this.active + 1;
            const back = this.active === 0 ? last : this.active - 1;
            const next = { ArrowDown: forward, ArrowRight: forward, ArrowUp: back, ArrowLeft: back, Home: 0, End: last }[event.key];

            if (next === undefined) return;

            event.preventDefault();
            this.select(next);
            this.$refs.tabs[next]?.focus();
        },
        submitForm() {
            if (this.emailInvalid || !this.email) {
                this.$toast.add({ severity: 'warn', summary: 'Check the email', detail: 'Enter a full address first.', life: 3000 });
            } else {
                this.$toast.add({ severity: 'success', summary: 'Account created', detail: `${this.email} on the ${this.plan} plan. Nothing was sent, this is a demo.`, life: 3000 });
            }
        }
    }
};
</script>
