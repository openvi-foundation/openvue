<template>
    <section class="landing-hero">
        <div class="hero-intro">
            <h1 class="hero-title">The complete UI toolkit for Vue and Nuxt</h1>
            <p class="hero-subtitle">80+ accessible, themeable components for Vue and Nuxt. OpenVue carries PrimeVue 4.5.5 forward under the MIT license, so the library your app already depends on stays free and keeps moving.</p>
            <div class="hero-actions">
                <OpenVueNuxtLink to="/setup" class="linkbox linkbox-primary">
                    <span>Get Started</span>
                    <i class="pi pi-arrow-right ms-4"></i>
                </OpenVueNuxtLink>
                <a href="https://github.com/openvi-foundation/openvue" target="_blank" rel="noopener noreferrer" class="linkbox">
                    <i class="pi pi-github me-3"></i>
                    <span>Star on GitHub</span>
                    <span v-if="starsLabel" class="linkbox-count">{{ starsLabel }}</span>
                </a>
            </div>
            <div class="hero-install">
                <code class="hero-install-command">{{ installCommand }}</code>
                <button type="button" class="hero-install-copy" :aria-label="`Copy ${installCommand} to clipboard`" @click="copyInstallCommand">
                    <i :class="['pi', copied ? 'pi-check' : 'pi-copy']"></i>
                </button>
            </div>
        </div>

        <div class="hero-stage-wrap">
            <div class="hero-theme-switch">
                <span id="hero-theme-label">Try a theme</span>
                <SelectButton :modelValue="selectedPreset" @update:modelValue="onPresetChange" :options="presetOptions" optionLabel="label" optionValue="value" :allowEmpty="false" aria-labelledby="hero-theme-label" size="small" />
            </div>

            <!-- Real components, not screenshots: they follow the theme picked above and the palette and dark mode set in the topbar. -->
            <div class="hero-stage">
                <div class="hero-col">
                    <div class="hero-card">
                        <div class="hero-card-title">Release date</div>
                        <DatePicker v-model="releaseDate" inline class="hero-calendar" />
                    </div>
                    <div class="hero-card">
                        <div>
                            <div class="hero-card-title">Verify your email</div>
                            <p class="hero-card-text">Enter the 4 digit code we sent you.</p>
                        </div>
                        <InputOtp v-model="otp" :length="4" integerOnly size="small" />
                        <Button label="Verify" size="small" severity="secondary" fluid @click="verifyOtp" />
                    </div>
                </div>

                <div class="hero-col">
                    <div class="hero-card">
                        <div class="hero-card-title">New project</div>
                        <div class="hero-field">
                            <label for="hero-project-name">Project name</label>
                            <InputText id="hero-project-name" v-model="project.name" size="small" fluid />
                        </div>
                        <div class="hero-field">
                            <span id="hero-framework-label">Framework</span>
                            <SelectButton v-model="project.framework" :options="frameworks" :allowEmpty="false" aria-labelledby="hero-framework-label" size="small" fluid />
                        </div>
                        <div class="hero-field">
                            <label for="hero-theme">Theme</label>
                            <Select v-model="project.theme" inputId="hero-theme" :options="themes" size="small" fluid />
                        </div>
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="project.typescript" inputId="hero-typescript" binary />
                            <label for="hero-typescript">Use TypeScript</label>
                        </div>
                        <div class="hero-card-footer">
                            <Button label="Reset" size="small" severity="secondary" text @click="resetProject" />
                            <Button label="Create" size="small" icon="pi pi-check" :disabled="!project.name" @click="createProject" />
                        </div>
                    </div>
                    <div class="hero-card">
                        <div class="flex items-center justify-between gap-4">
                            <div class="hero-card-title">Storage</div>
                            <Tag :value="`${storageUsed} of 100 GB`" severity="secondary" />
                        </div>
                        <MeterGroup :value="storage" />
                    </div>
                </div>

                <div class="hero-col">
                    <div class="hero-card">
                        <div class="hero-card-title">Notifications</div>
                        <div v-for="item of notifications" :key="item.id" class="hero-toggle-row">
                            <label :for="`hero-notify-${item.id}`">
                                <span class="hero-toggle-label">{{ item.label }}</span>
                                <span class="hero-toggle-detail">{{ item.detail }}</span>
                            </label>
                            <ToggleSwitch v-model="item.enabled" :inputId="`hero-notify-${item.id}`" />
                        </div>
                    </div>
                    <div class="hero-card">
                        <div class="hero-card-title">Project files</div>
                        <Tree v-model:expandedKeys="expandedFiles" :value="files" class="hero-tree" />
                    </div>
                </div>

                <div class="hero-col">
                    <div class="hero-card">
                        <div class="flex items-center justify-between gap-4">
                            <div class="hero-card-title">Team</div>
                            <Tag :value="`${seats} seats`" severity="secondary" />
                        </div>
                        <AvatarGroup>
                            <Avatar v-for="avatar of avatars" :key="avatar" :image="`/demo/images/landing/avatars/${avatar}.svg`" shape="circle" />
                            <Avatar v-if="seats > avatars.length" :label="`+${seats - avatars.length}`" shape="circle" />
                        </AvatarGroup>
                        <Slider v-model="seats" :min="avatars.length" :max="50" aria-label="Seats" />
                    </div>
                    <div class="hero-card">
                        <div class="flex items-center justify-between gap-4">
                            <div class="hero-card-title">Brand color</div>
                            <span class="hero-color-value">#{{ brandColor }}</span>
                        </div>
                        <ColorPicker v-model="brandColor" inline class="hero-colorpicker" aria-label="Brand color" />
                    </div>
                    <div class="hero-card">
                        <div class="hero-card-title">How was setup?</div>
                        <Rating v-model="rating" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { PRESET_OPTIONS, applySitePreset, selectedPreset } from '@/service/theme/presets';

const defaultProject = () => ({ name: 'my-app', framework: 'Nuxt', theme: 'Aura', typescript: true });

const file = (key, label, icon = 'pi pi-file') => ({ key, label, icon });
const folder = (key, label, children) => ({ key, label, icon: 'pi pi-folder', children });

export default {
    setup() {
        const { starsLabel } = useGitHubStars();

        return { starsLabel };
    },
    data() {
        const releaseDate = new Date();

        releaseDate.setHours(0, 0, 0, 0);
        releaseDate.setDate(releaseDate.getDate() + 7);

        return {
            installCommand: 'npm install openvue @openvue/themes',
            copied: false,
            copyTimeout: null,
            project: defaultProject(),
            presetOptions: PRESET_OPTIONS,
            frameworks: ['Vue', 'Nuxt'],
            themes: ['Aura', 'Lara', 'Nora'],
            storage: [
                { label: 'Apps', value: 16, color: '#34d399' },
                { label: 'Media', value: 24, color: '#fbbf24' },
                { label: 'Backups', value: 10, color: '#60a5fa' }
            ],
            otp: null,
            releaseDate,
            notifications: [
                { id: 'releases', label: 'Releases', detail: 'New versions and changelogs', enabled: true },
                { id: 'security', label: 'Security', detail: 'Advisories for your dependencies', enabled: true },
                { id: 'digest', label: 'Weekly digest', detail: 'A summary every Monday', enabled: false }
            ],
            files: [
                folder('components', 'components', [file('components/AppHeader.vue', 'AppHeader.vue'), file('components/OrderTable.vue', 'OrderTable.vue')]),
                folder('pages', 'pages', [file('pages/index.vue', 'index.vue')]),
                file('app.vue', 'app.vue'),
                file('nuxt.config.ts', 'nuxt.config.ts')
            ],
            expandedFiles: { components: true },
            avatars: ['avatar-02', 'avatar-04', 'avatar-07', 'avatar-11'],
            seats: 12,
            brandColor: '10b981',
            rating: 4
        };
    },
    computed: {
        selectedPreset() {
            return selectedPreset(this.$appState);
        },
        storageUsed() {
            return this.storage.reduce((sum, item) => sum + item.value, 0);
        }
    },
    beforeUnmount() {
        if (this.copyTimeout) {
            clearTimeout(this.copyTimeout);
        }
    },
    methods: {
        onPresetChange(value) {
            applySitePreset(this.$appState, this.$siteTheme, value);
        },
        async copyInstallCommand() {
            try {
                await navigator.clipboard.writeText(this.installCommand);
            } catch {
                return;
            }

            this.copied = true;

            if (this.copyTimeout) {
                clearTimeout(this.copyTimeout);
            }

            this.copyTimeout = setTimeout(() => (this.copied = false), 2000);
        },
        createProject() {
            const { name, framework, theme, typescript } = this.project;

            this.$toast.add({ severity: 'success', summary: 'Project created', detail: `${name}: ${framework}, ${theme}${typescript ? ', TypeScript' : ''}`, life: 3000 });
        },
        resetProject() {
            this.project = defaultProject();
        },
        verifyOtp() {
            if (String(this.otp ?? '').length === 4) {
                this.$toast.add({ severity: 'success', summary: 'Email verified', detail: 'Any 4 digits work here.', life: 3000 });
            } else {
                this.$toast.add({ severity: 'warn', summary: 'Code incomplete', detail: 'Enter all 4 digits.', life: 3000 });
            }
        }
    }
};
</script>
