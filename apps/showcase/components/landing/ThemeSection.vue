<template>
    <section class="landing-themes py-20 px-8 lg:px-20">
        <div class="themes-container">
            <div class="themes-header">
                <h2 class="themes-title">Built for data-heavy screens</h2>
                <p class="themes-detail">
                    <span class="themes-detail-desktop">Search, sort, select and page through rows.</span>
                    <span class="themes-detail-mobile">Search, filter and open records, laid out for a phone.</span>
                </p>
            </div>
            <div class="box overflow-hidden p-8 table-container">
                <DataTable
                    ref="table"
                    v-model:selection="selectedCustomers"
                    v-model:filters="filters"
                    v-model:expandedRows="expandedRows"
                    :value="customers"
                    paginator
                    :rows="5"
                    :rowsPerPageOptions="[5, 10, 20]"
                    dataKey="id"
                    rowHover
                    sortMode="multiple"
                    removableSort
                    resizableColumns
                    columnResizeMode="fit"
                    reorderableColumns
                    filterDisplay="menu"
                    :loading="loading"
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    exportFilename="customers"
                    :globalFilterFields="['name', 'country.name', 'representative.name', 'status']"
                    @value-change="onValueChange"
                >
                    <template #header>
                        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                            <div>
                                <span class="text-xl font-bold">Customers</span>
                                <div class="text-sm text-muted-color mt-1">
                                    {{ filteredCount }} of {{ customers.length }} shown<template v-if="selectedCustomers?.length">, {{ selectedCustomers.length }} selected</template>
                                </div>
                            </div>
                            <div class="flex flex-wrap items-center gap-2">
                                <Button type="button" icon="pi pi-filter-slash" label="Clear" variant="outlined" severity="secondary" @click="clearFilters" />
                                <Button type="button" icon="pi pi-download" label="Export" variant="outlined" severity="secondary" @click="$refs.table.exportCSV()" />
                                <IconField class="w-full sm:w-auto">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Search" class="w-full" />
                                </IconField>
                            </div>
                        </div>
                    </template>
                    <template #empty> No customers found. </template>
                    <template #loading> Loading customers data. Please wait. </template>
                    <Column expander style="width: 3rem" :exportable="false" />
                    <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                    <Column field="name" header="Name" sortable style="min-width: 11rem">
                        <template #body="{ data }">
                            {{ data.name }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
                        </template>
                    </Column>
                    <Column field="country.name" header="Country" sortable style="min-width: 10rem">
                        <template #body="{ data }">
                            <div class="flex items-center gap-2">
                                <span class="inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-surface bg-emphasis text-xs font-semibold uppercase tracking-wide">{{ data.country.code }}</span>
                                <span>{{ data.country.name }}</span>
                            </div>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText v-model="filterModel.value" type="text" placeholder="Search by country" />
                        </template>
                    </Column>
                    <Column field="representative.name" header="Agent" sortable sortField="representative.name" filterField="representative" :showFilterMatchModes="false" :filterMenuStyle="{ width: '16rem' }" style="min-width: 11rem">
                        <template #body="{ data }">
                            <div class="flex items-center gap-2">
                                <img :alt="data.representative.name" :src="avatarFor(data.representative.image)" width="32" />
                                <span>{{ data.representative.name }}</span>
                            </div>
                        </template>
                        <template #filter="{ filterModel }">
                            <MultiSelect v-model="filterModel.value" :options="representatives" optionLabel="name" placeholder="Any" fluid>
                                <template #option="{ option }">
                                    <div class="flex items-center gap-2">
                                        <img :alt="option.name" :src="avatarFor(option.image)" width="24" />
                                        <span>{{ option.name }}</span>
                                    </div>
                                </template>
                            </MultiSelect>
                        </template>
                    </Column>
                    <Column field="date" header="Date" sortable dataType="date" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ formatDate(data.date) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                        </template>
                    </Column>
                    <Column field="balance" header="Balance" sortable dataType="numeric" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ formatCurrency(data.balance) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
                        </template>
                    </Column>
                    <Column field="status" header="Status" sortable :filterMenuStyle="{ width: '14rem' }" style="min-width: 9rem">
                        <template #body="{ data }">
                            <Tag :value="data.status" :severity="getSeverity(data.status)" class="text-sm font-bold" />
                        </template>
                        <template #filter="{ filterModel }">
                            <Select v-model="filterModel.value" :options="statuses" placeholder="Select one" showClear fluid>
                                <template #option="{ option }">
                                    <Tag :value="option" :severity="getSeverity(option)" />
                                </template>
                            </Select>
                        </template>
                    </Column>
                    <Column field="activity" header="Activity" sortable :showFilterMatchModes="false" style="min-width: 7rem">
                        <template #body="{ data }">
                            <ProgressBar :value="data.activity" :showValue="false" style="height: 7px" />
                        </template>
                        <template #filter="{ filterModel }">
                            <Slider v-model="filterModel.value" range class="m-4" />
                            <div class="flex items-center justify-between px-2">
                                <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                                <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column headerStyle="min-width: 4rem; text-align: center" bodyStyle="text-align: center; overflow: visible" :exportable="false">
                        <template #body>
                            <Button type="button" icon="pi pi-cog" text></Button>
                        </template>
                    </Column>
                    <template #expansion="{ data }">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 py-2">
                            <div>
                                <div class="text-sm text-muted-color">Company</div>
                                <div class="font-medium mt-1">{{ data.company }}</div>
                            </div>
                            <div>
                                <div class="text-sm text-muted-color">Customer ID</div>
                                <div class="font-medium mt-1">#{{ data.id }}</div>
                            </div>
                            <div>
                                <div class="text-sm text-muted-color">Verified</div>
                                <div class="font-medium mt-1 flex items-center gap-2">
                                    <i :class="['pi', data.verified ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500']"></i>
                                    <span>{{ data.verified ? 'Yes' : 'No' }}</span>
                                </div>
                            </div>
                            <div>
                                <div class="text-sm text-muted-color">Activity</div>
                                <div class="font-medium mt-1">{{ data.activity }}%</div>
                            </div>
                        </div>
                    </template>
                </DataTable>
            </div>
            <CustomersMobileDemo :customers="customers" :agentAvatar="avatarFor" class="themes-mobile" />
            <nav class="themes-more" aria-label="More data components">
                <span class="themes-more-label">More like this:</span>
                <OpenVueNuxtLink v-for="link of moreComponents" :key="link.to" :to="link.to" class="themes-more-link">{{ link.label }}</OpenVueNuxtLink>
                <OpenVueNuxtLink to="/components" class="themes-more-all">
                    <span>View all 80+ components</span>
                    <i class="pi pi-arrow-right" aria-hidden="true"></i>
                </OpenVueNuxtLink>
            </nav>
        </div>
    </section>
</template>

<script>
import { landingCustomers } from '@/service/LandingCustomers';
import { FilterMatchMode, FilterOperator } from '@openvue/core/api';

/* Seeded synchronously so the server-rendered homepage carries real rows. An empty table that
   reads "No customers found." in the initial HTML looks like an error page to search engines.

   The date is built from its parts on purpose. `new Date('2015-09-13')` is midnight UTC, and
   toLocaleDateString then prints the day before in any timezone west of Greenwich, so the server
   on UTC and a browser in the Americas disagreed on every date cell and hydration reported a
   mismatch. Local midnight formats to the same calendar date everywhere. */
function parseLocalDate(value) {
    const [year, month, day] = value.split('-').map(Number);

    return new Date(year, month - 1, day);
}

function seedCustomers() {
    return landingCustomers.map((customer) => ({ ...customer, date: parseLocalDate(customer.date) }));
}

function createFilters() {
    return {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
}

function uniqueRepresentatives() {
    const seen = new Map();

    landingCustomers.forEach(({ representative }) => seen.set(representative.name, representative));

    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export default {
    data() {
        return {
            customers: seedCustomers(),
            selectedCustomers: null,
            filters: createFilters(),
            expandedRows: {},
            filteredCount: landingCustomers.length,
            statuses: ['unqualified', 'qualified', 'new', 'negotiation', 'renewal'],
            representatives: uniqueRepresentatives(),
            loading: false,
            moreComponents: [
                { label: 'TreeTable', to: '/treetable' },
                { label: 'VirtualScroller', to: '/virtualscroller' },
                { label: 'Chart', to: '/chart' },
                { label: 'OrganizationChart', to: '/organizationchart' },
                { label: 'Editor', to: '/editor' }
            ],
            representativeAvatars: ['amyelsner.png', 'annafali.png', 'asiyajavayant.png', 'bernardodominic.png', 'elwinsharvill.png', 'ionibowcher.png', 'ivanmagalhaes.png', 'onyamalimba.png', 'stephenshaw.png', 'xuxuefeng.png']
        };
    },
    methods: {
        clearFilters() {
            this.filters = createFilters();
        },
        onValueChange(rows) {
            this.filteredCount = rows.length;
        },
        avatarFor(image) {
            const index = this.representativeAvatars.indexOf(image);

            return `/demo/images/landing/avatars/avatar-${String((index < 0 ? 0 : index) + 1).padStart(2, '0')}.svg`;
        },
        formatDate(value) {
            return value.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        },
        formatCurrency(value) {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        },
        getSeverity(status) {
            switch (status) {
                case 'unqualified':
                    return 'danger';

                case 'qualified':
                    return 'success';

                case 'new':
                    return 'info';

                case 'negotiation':
                    return 'warn';

                case 'renewal':
                    return null;
            }
        }
    }
};
</script>
