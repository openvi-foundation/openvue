<template>
    <div class="theme-builder-cards">
        <Card class="theme-builder-card">
            <template #title>Welcome back</template>
            <template #subtitle>Sign in to your workspace.</template>
            <template #content>
                <form class="flex flex-col gap-3" @submit.prevent>
                    <IconField>
                        <InputIcon class="pi pi-envelope" />
                        <InputText v-model="email" type="email" placeholder="you@company.com" aria-label="Email" fluid />
                    </IconField>
                    <Password v-model="password" :feedback="false" toggleMask placeholder="Password" aria-label="Password" fluid />
                    <div class="flex items-center justify-between gap-2">
                        <span class="flex items-center gap-2"><Checkbox v-model="remember" inputId="tbc-remember" binary /><label for="tbc-remember">Remember me</label></span>
                        <a href="#" class="text-primary font-medium" @click.prevent>Forgot password?</a>
                    </div>
                    <Button type="submit" label="Sign in" fluid />
                    <Button type="button" label="Continue with GitHub" icon="pi pi-github" severity="secondary" outlined fluid />
                </form>
            </template>
        </Card>

        <Card class="theme-builder-card">
            <template #title>
                <div class="flex items-center justify-between gap-2">
                    <span>Revenue</span>
                    <Tag value="+14.2%" severity="success" />
                </div>
            </template>
            <template #content>
                <div class="text-3xl font-semibold">€24,580</div>
                <div class="text-sm text-muted-color mt-1">Up from €21,520 last month</div>
                <div class="theme-builder-bars" role="img" aria-label="Revenue per month">
                    <span v-for="(value, index) of revenue" :key="index" :class="['theme-builder-bar', { 'theme-builder-bar-current': index === revenue.length - 1 }]" :style="{ height: value + '%' }"></span>
                </div>
            </template>
        </Card>

        <Card class="theme-builder-card">
            <template #title>Schedule</template>
            <template #content>
                <DatePicker v-model="date" inline class="theme-builder-datepicker" />
            </template>
        </Card>

        <Card class="theme-builder-card">
            <template #title>Team</template>
            <template #subtitle>Who can edit this project.</template>
            <template #content>
                <ul class="flex flex-col gap-3 list-none p-0 m-0">
                    <li v-for="member of members" :key="member.name" class="flex items-center gap-3">
                        <Avatar :image="member.avatar" shape="circle" />
                        <span class="flex-1 min-w-0 font-medium truncate">{{ member.name }}</span>
                        <Select v-model="member.role" :options="roles" size="small" :aria-label="'Role of ' + member.name" />
                    </li>
                </ul>
            </template>
        </Card>

        <Card class="theme-builder-card">
            <template #title>Choose a plan</template>
            <template #content>
                <div class="flex flex-col gap-2">
                    <label v-for="item of plans" :key="item.id" :for="item.id" :class="['theme-builder-plan', { 'theme-builder-plan-active': plan === item.id }]">
                        <RadioButton v-model="plan" :inputId="item.id" :value="item.id" />
                        <span class="flex-1">
                            <span class="block font-medium">{{ item.name }}</span>
                            <span class="block text-sm text-muted-color">{{ item.detail }}</span>
                        </span>
                        <span class="font-semibold">{{ item.price }}</span>
                    </label>
                </div>
            </template>
            <template #footer>
                <Button label="Continue" icon="pi pi-arrow-right" iconPos="right" fluid />
            </template>
        </Card>

        <Card class="theme-builder-card">
            <template #title>Uploads</template>
            <template #content>
                <ul class="flex flex-col gap-4 list-none p-0 m-0">
                    <li v-for="file of uploads" :key="file.name">
                        <div class="flex justify-between gap-2 text-sm mb-2">
                            <span class="font-medium truncate"><i :class="file.icon" class="mr-2 text-muted-color" aria-hidden="true"></i>{{ file.name }}</span>
                            <span class="text-muted-color">{{ file.progress }}%</span>
                        </div>
                        <ProgressBar :value="file.progress" :showValue="false" class="theme-builder-progress" />
                    </li>
                </ul>
            </template>
        </Card>

        <Card class="theme-builder-card">
            <template #title>Activity</template>
            <template #content>
                <Timeline :value="activity" class="theme-builder-timeline">
                    <template #content="{ item }">
                        <div class="font-medium">{{ item.title }}</div>
                        <div class="text-sm text-muted-color mb-3">{{ item.time }}</div>
                    </template>
                </Timeline>
            </template>
        </Card>

        <Card class="theme-builder-card">
            <template #title>Preferences</template>
            <template #content>
                <div class="flex flex-col gap-5">
                    <div class="flex flex-col gap-3">
                        <span id="tbc-volume" class="font-medium">Volume</span>
                        <Slider v-model="volume" aria-labelledby="tbc-volume" />
                    </div>
                    <SelectButton v-model="appearance" :options="['Light', 'Dark', 'Auto']" :allowEmpty="false" aria-label="Appearance" />
                    <div class="flex items-center justify-between gap-2">
                        <span class="font-medium">Rate this release</span>
                        <Rating v-model="rating" />
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<script>
const avatar = (index) => `/demo/images/landing/avatars/avatar-${String(index).padStart(2, '0')}.svg`;

export default {
    data() {
        return {
            email: '',
            password: '',
            remember: true,
            revenue: [42, 55, 48, 62, 58, 70, 66, 74, 69, 81, 78, 92],
            date: new Date(),
            members: [
                { name: 'Ana Petrović', role: 'Owner', avatar: avatar(1) },
                { name: 'Marcus Lee', role: 'Editor', avatar: avatar(4) },
                { name: 'Priya Shah', role: 'Viewer', avatar: avatar(7) }
            ],
            roles: ['Owner', 'Editor', 'Viewer'],
            plan: 'tbc-plan-pro',
            plans: [
                { id: 'tbc-plan-solo', name: 'Solo', detail: 'For personal projects.', price: '€0' },
                { id: 'tbc-plan-pro', name: 'Pro', detail: 'For growing teams.', price: '€19' },
                { id: 'tbc-plan-scale', name: 'Scale', detail: 'SSO and audit logs.', price: '€49' }
            ],
            uploads: [
                { name: 'brand-guidelines.pdf', icon: 'pi pi-file-pdf', progress: 100 },
                { name: 'hero-video.mp4', icon: 'pi pi-video', progress: 64 },
                { name: 'icons.zip', icon: 'pi pi-box', progress: 18 }
            ],
            activity: [
                { title: 'Ana merged “Theme tokens”', time: '2 minutes ago' },
                { title: 'Marcus deployed to production', time: '1 hour ago' },
                { title: 'Priya opened 3 issues', time: 'Yesterday' }
            ],
            volume: 60,
            appearance: 'Auto',
            rating: 4
        };
    }
};
</script>
