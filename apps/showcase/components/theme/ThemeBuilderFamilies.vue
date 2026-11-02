<template>
    <div class="theme-builder-families">
        <section class="theme-builder-family" aria-labelledby="tbf-buttons">
            <h3 id="tbf-buttons">Buttons</h3>
            <div class="theme-builder-family-row">
                <Button label="Save" />
                <Button label="Cancel" severity="secondary" />
                <Button label="Preview" outlined />
                <Button label="Skip" text />
                <SplitButton label="Publish" :model="splitItems" />
            </div>
            <div class="theme-builder-family-row">
                <Button label="Success" severity="success" size="small" />
                <Button label="Info" severity="info" size="small" />
                <Button label="Warn" severity="warn" size="small" />
                <Button label="Danger" severity="danger" size="small" />
                <Button label="Help" severity="help" size="small" />
                <Button label="Contrast" severity="contrast" size="small" />
            </div>
            <div class="theme-builder-family-row">
                <Button icon="pi pi-check" rounded aria-label="Confirm" />
                <Button icon="pi pi-bookmark" rounded outlined aria-label="Bookmark" />
                <Button icon="pi pi-heart" rounded text severity="danger" aria-label="Like" />
                <ButtonGroup>
                    <Button icon="pi pi-align-left" severity="secondary" aria-label="Align left" />
                    <Button icon="pi pi-align-center" severity="secondary" aria-label="Align centre" />
                    <Button icon="pi pi-align-right" severity="secondary" aria-label="Align right" />
                </ButtonGroup>
                <Button label="Saving" loading />
            </div>
        </section>

        <section class="theme-builder-family" aria-labelledby="tbf-forms">
            <h3 id="tbf-forms">Forms</h3>
            <div class="theme-builder-family-grid">
                <FloatLabel variant="on">
                    <InputText id="tbf-name" v-model="form.name" fluid />
                    <label for="tbf-name">Full name</label>
                </FloatLabel>
                <IconField>
                    <InputIcon class="pi pi-search" />
                    <InputText v-model="form.search" placeholder="Search" aria-label="Search" fluid />
                </IconField>
                <Password v-model="form.password" :feedback="false" toggleMask placeholder="Password" fluid aria-label="Password" />
                <InputNumber v-model="form.amount" mode="currency" currency="EUR" locale="en-IE" fluid aria-label="Amount" />
                <Select v-model="form.country" :options="countries" placeholder="Country" fluid aria-label="Country" />
                <DatePicker v-model="form.date" showIcon iconDisplay="input" placeholder="Pick a date" fluid aria-label="Date" />
                <MultiSelect v-model="form.tags" :options="tags" display="chip" placeholder="Tags" fluid aria-label="Tags" class="theme-builder-span" />
                <InputGroup class="theme-builder-span">
                    <InputGroupAddon>https://</InputGroupAddon>
                    <InputText v-model="form.site" aria-label="Website" />
                    <InputGroupAddon>.com</InputGroupAddon>
                </InputGroup>
                <div class="theme-builder-span flex flex-col gap-1">
                    <InputText v-model="form.email" invalid placeholder="Email" aria-label="Email" fluid />
                    <Message severity="error" size="small" variant="simple">Enter a valid email address.</Message>
                </div>
                <Textarea v-model="form.note" rows="2" placeholder="Add a note" fluid aria-label="Note" class="theme-builder-span" />
            </div>
        </section>

        <section class="theme-builder-family" aria-labelledby="tbf-selection">
            <h3 id="tbf-selection">Selection</h3>
            <div class="theme-builder-family-row">
                <span class="flex items-center gap-2"><Checkbox v-model="choice.terms" inputId="tbf-terms" binary /><label for="tbf-terms">Accept terms</label></span>
                <span class="flex items-center gap-2"><RadioButton v-model="choice.billing" inputId="tbf-monthly" value="monthly" /><label for="tbf-monthly">Monthly</label></span>
                <span class="flex items-center gap-2"><RadioButton v-model="choice.billing" inputId="tbf-yearly" value="yearly" /><label for="tbf-yearly">Yearly</label></span>
                <span class="flex items-center gap-2"><ToggleSwitch v-model="choice.alerts" inputId="tbf-alerts" /><label for="tbf-alerts">Alerts</label></span>
            </div>
            <div class="theme-builder-family-row">
                <SelectButton v-model="choice.view" :options="['Day', 'Week', 'Month']" :allowEmpty="false" aria-label="Calendar view" />
                <ToggleButton v-model="choice.bold" onLabel="Bold" offLabel="Bold" onIcon="pi pi-check" offIcon="pi pi-times" aria-label="Bold" />
                <Rating v-model="choice.rating" />
            </div>
            <div class="theme-builder-family-row theme-builder-family-slider">
                <Slider v-model="choice.volume" aria-label="Volume" class="flex-1" />
                <Knob v-model="choice.volume" :size="64" aria-label="Volume" />
            </div>
        </section>

        <section class="theme-builder-family" aria-labelledby="tbf-data">
            <h3 id="tbf-data">Data</h3>
            <DataTable v-model:selection="selectedOrders" :value="orders" dataKey="id" size="small" paginator :rows="4" removableSort>
                <Column selectionMode="multiple" headerStyle="width: 2.5rem" />
                <Column field="id" header="Order" sortable />
                <Column field="customer" header="Customer" sortable />
                <Column field="status" header="Status">
                    <template #body="{ data }">
                        <Tag :value="data.status" :severity="statusSeverity[data.status]" />
                    </template>
                </Column>
                <Column field="total" header="Total" />
            </DataTable>
        </section>

        <section class="theme-builder-family" aria-labelledby="tbf-navigation">
            <h3 id="tbf-navigation">Navigation</h3>
            <Breadcrumb :home="{ icon: 'pi pi-home' }" :model="breadcrumb" />
            <Tabs value="overview" class="mt-2">
                <TabList>
                    <Tab value="overview">Overview</Tab>
                    <Tab value="activity">Activity</Tab>
                    <Tab value="settings">Settings</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="overview"><p class="m-0 text-muted-color">Three projects need review this week.</p></TabPanel>
                    <TabPanel value="activity"><p class="m-0 text-muted-color">No new activity.</p></TabPanel>
                    <TabPanel value="settings"><p class="m-0 text-muted-color">Settings are saved automatically.</p></TabPanel>
                </TabPanels>
            </Tabs>
            <Paginator :rows="10" :totalRecords="120" :pageLinkSize="3" class="mt-2" />
        </section>

        <section class="theme-builder-family" aria-labelledby="tbf-feedback">
            <h3 id="tbf-feedback">Feedback</h3>
            <div class="flex flex-col gap-2">
                <Message severity="success" icon="pi pi-check-circle">Deployment finished in 42 seconds.</Message>
                <Message severity="info" icon="pi pi-info-circle">A new version is available.</Message>
                <Message severity="warn" icon="pi pi-exclamation-triangle">Your trial ends in three days.</Message>
                <Message severity="error" icon="pi pi-times-circle">The payment method was declined.</Message>
            </div>
            <div class="theme-builder-family-row">
                <Tag value="New" />
                <Tag value="Paid" severity="success" />
                <Tag value="Pending" severity="warn" />
                <Tag value="Overdue" severity="danger" />
                <Badge value="8" />
                <OverlayBadge value="3" severity="danger"><i class="pi pi-bell text-xl text-muted-color" aria-label="3 notifications"></i></OverlayBadge>
                <ProgressSpinner style="width: 1.75rem; height: 1.75rem" strokeWidth="6" aria-label="Loading" />
            </div>
            <ProgressBar :value="64" class="mt-3" />
            <div class="theme-builder-family-row">
                <Skeleton width="2.5rem" height="2.5rem" shape="circle" />
                <div class="flex-1 flex flex-col gap-2">
                    <Skeleton width="60%" />
                    <Skeleton width="85%" />
                </div>
                <Button label="Show toast" icon="pi pi-bell" outlined size="small" @click="$toast.add({ severity: 'success', summary: 'Saved', detail: 'Your changes are live.', life: 3000 })" />
            </div>
        </section>

        <section class="theme-builder-family" aria-labelledby="tbf-overlays">
            <h3 id="tbf-overlays">Overlays</h3>
            <div class="theme-builder-family-row">
                <Button label="Dialog" icon="pi pi-window-maximize" severity="secondary" @click="dialogVisible = true" />
                <Button label="Popover" icon="pi pi-comment" severity="secondary" @click="$refs.popover.toggle($event)" />
                <Button label="Drawer" icon="pi pi-arrow-left" severity="secondary" @click="drawerVisible = true" />
                <Button label="Menu" icon="pi pi-ellipsis-v" severity="secondary" aria-haspopup="true" @click="$refs.menu.toggle($event)" />
                <Button v-tooltip.top="'Tooltips follow the theme too'" label="Tooltip" icon="pi pi-info-circle" text />
            </div>
            <Dialog v-model:visible="dialogVisible" modal header="Invite a teammate" :style="{ width: '26rem' }">
                <p class="m-0 mb-4 text-muted-color">They will get an email with a link to join your workspace.</p>
                <InputText placeholder="name@company.com" fluid aria-label="Email to invite" />
                <template #footer>
                    <Button label="Cancel" text severity="secondary" @click="dialogVisible = false" />
                    <Button label="Send invite" @click="dialogVisible = false" />
                </template>
            </Dialog>
            <Popover ref="popover">
                <div class="flex flex-col gap-2" style="width: 16rem">
                    <span class="font-medium">Share this view</span>
                    <InputGroup>
                        <InputText value="openvue.dev/v/8f2k" readonly aria-label="Link" />
                        <Button icon="pi pi-copy" severity="secondary" aria-label="Copy link" />
                    </InputGroup>
                </div>
            </Popover>
            <Drawer v-model:visible="drawerVisible" header="Filters" position="right">
                <div class="flex flex-col gap-4">
                    <span class="flex items-center gap-2"><Checkbox v-model="filters" inputId="tbf-open" value="open" /><label for="tbf-open">Open</label></span>
                    <span class="flex items-center gap-2"><Checkbox v-model="filters" inputId="tbf-closed" value="closed" /><label for="tbf-closed">Closed</label></span>
                    <Button label="Apply filters" @click="drawerVisible = false" />
                </div>
            </Drawer>
            <Menu ref="menu" :model="menuItems" popup />
        </section>

        <section class="theme-builder-family" aria-labelledby="tbf-panels">
            <h3 id="tbf-panels">Panels and media</h3>
            <Accordion value="0">
                <AccordionPanel value="0">
                    <AccordionHeader>What is a preset?</AccordionHeader>
                    <AccordionContent><p class="m-0 text-muted-color">A set of design tokens that styles every component.</p></AccordionContent>
                </AccordionPanel>
                <AccordionPanel value="1">
                    <AccordionHeader>Can I change it later?</AccordionHeader>
                    <AccordionContent><p class="m-0 text-muted-color">Yes. Open it in the designer and edit any token.</p></AccordionContent>
                </AccordionPanel>
            </Accordion>
            <div class="theme-builder-family-row">
                <AvatarGroup>
                    <Avatar v-for="index of [1, 4, 7]" :key="index" :image="avatar(index)" shape="circle" />
                    <Avatar label="+4" shape="circle" />
                </AvatarGroup>
                <Chip label="Design" icon="pi pi-palette" />
                <Chip label="Vue" removable />
            </div>
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {
            splitItems: [{ label: 'Schedule' }, { label: 'Save as draft' }],
            form: { name: 'Ana Petrović', search: '', password: '', amount: 1250, country: null, date: null, tags: ['Design', 'Vue'], site: 'openvue', email: 'ana@', note: '' },
            countries: ['Germany', 'Japan', 'Serbia', 'United States'],
            tags: ['Design', 'Vue', 'Accessibility', 'Data'],
            choice: { terms: true, billing: 'yearly', alerts: true, view: 'Week', bold: true, rating: 4, volume: 60 },
            orders: [
                { id: '#1042', customer: 'Northwind', status: 'Paid', total: '€1,240' },
                { id: '#1041', customer: 'Globex', status: 'Pending', total: '€860' },
                { id: '#1040', customer: 'Initech', status: 'Refunded', total: '€310' },
                { id: '#1039', customer: 'Umbrella', status: 'Paid', total: '€2,095' },
                { id: '#1038', customer: 'Hooli', status: 'Overdue', total: '€455' },
                { id: '#1037', customer: 'Soylent', status: 'Paid', total: '€1,780' }
            ],
            statusSeverity: { Paid: 'success', Pending: 'warn', Refunded: 'secondary', Overdue: 'danger' },
            selectedOrders: [],
            breadcrumb: [{ label: 'Projects' }, { label: 'Website' }, { label: 'Settings' }],
            dialogVisible: false,
            drawerVisible: false,
            filters: ['open'],
            menuItems: [{ label: 'Rename', icon: 'pi pi-pencil' }, { label: 'Duplicate', icon: 'pi pi-copy' }, { separator: true }, { label: 'Delete', icon: 'pi pi-trash' }]
        };
    },
    methods: {
        avatar(index) {
            return `/demo/images/landing/avatars/avatar-${String(index).padStart(2, '0')}.svg`;
        }
    }
};
</script>
