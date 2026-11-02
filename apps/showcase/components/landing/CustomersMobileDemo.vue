<template>
    <div class="customers-mobile box">
        <div class="customers-mobile-head">
            <div>
                <div class="customers-mobile-title">Customers</div>
                <div class="customers-mobile-summary">{{ rows.length }} shown, {{ formatCurrency(totalBalance) }} in balances</div>
            </div>
            <Button type="button" :icon="sortIcon" severity="secondary" variant="outlined" :aria-label="`Sort by balance, ${sortDescending ? 'highest' : 'lowest'} first`" @click="sortDescending = !sortDescending" />
        </div>

        <div class="customers-mobile-filters">
            <IconField class="flex-1 min-w-0">
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="query" placeholder="Search" aria-label="Search customers" fluid />
            </IconField>
            <Select v-model="status" :options="statusOptions" optionLabel="label" optionValue="value" aria-label="Filter by status" class="customers-mobile-status" />
        </div>

        <VirtualScroller v-if="rows.length" :items="rows" :itemSize="72" class="customers-mobile-list">
            <template #item="{ item }">
                <button type="button" class="customers-mobile-row" @click="open(item)">
                    <Avatar :label="initials(item.name)" shape="circle" />
                    <span class="customers-mobile-main">
                        <span class="customers-mobile-name">{{ item.name }}</span>
                        <span class="customers-mobile-meta">{{ item.country.name }}</span>
                    </span>
                    <span class="customers-mobile-side">
                        <span class="customers-mobile-balance">{{ formatCurrency(item.balance) }}</span>
                        <Tag :value="item.status" :severity="getSeverity(item.status)" />
                    </span>
                </button>
            </template>
        </VirtualScroller>
        <div v-else class="customers-mobile-empty">No customers found.</div>

        <Drawer v-model:visible="sheetVisible" position="bottom" :header="selected?.name" class="customers-mobile-sheet">
            <div v-if="selected" class="flex flex-col gap-5">
                <div class="flex items-center justify-between gap-4">
                    <span class="text-muted-color">{{ selected.company }}</span>
                    <Tag :value="selected.status" :severity="getSeverity(selected.status)" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <div class="text-sm text-muted-color">Balance</div>
                        <div class="font-semibold text-lg mt-1">{{ formatCurrency(selected.balance) }}</div>
                    </div>
                    <div>
                        <div class="text-sm text-muted-color">Country</div>
                        <div class="font-semibold text-lg mt-1">{{ selected.country.name }}</div>
                    </div>
                </div>
                <div>
                    <div class="flex justify-between text-sm text-muted-color mb-2">
                        <span>Activity</span>
                        <span>{{ selected.activity }}%</span>
                    </div>
                    <ProgressBar :value="selected.activity" :showValue="false" style="height: 7px" />
                </div>
                <div class="flex items-center gap-3">
                    <img :alt="selected.representative.name" :src="agentAvatar(selected.representative.image)" width="36" />
                    <div>
                        <div class="text-sm text-muted-color">Agent</div>
                        <div class="font-medium">{{ selected.representative.name }}</div>
                    </div>
                    <Tag v-if="selected.verified" value="Verified" severity="success" icon="pi pi-check" class="ms-auto" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <Button label="Email" icon="pi pi-envelope" severity="secondary" @click="notify('Email')" />
                    <Button label="Call" icon="pi pi-phone" @click="notify('Call')" />
                </div>
            </div>
        </Drawer>
    </div>
</template>

<script>
/* The landing DataTable needs a laptop to make sense, so phones get the same customers as a
   searchable list with a bottom sheet instead. */
export default {
    props: {
        customers: {
            type: Array,
            required: true
        },
        agentAvatar: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            query: '',
            status: 'all',
            sortDescending: true,
            selected: null,
            sheetVisible: false,
            statusOptions: [
                { label: 'All', value: 'all' },
                { label: 'New', value: 'new' },
                { label: 'Qualified', value: 'qualified' },
                { label: 'Negotiation', value: 'negotiation' },
                { label: 'Renewal', value: 'renewal' },
                { label: 'Unqualified', value: 'unqualified' }
            ]
        };
    },
    computed: {
        rows() {
            const query = this.query.trim().toLowerCase();
            const rows = this.customers.filter((customer) => (this.status === 'all' || customer.status === this.status) && (!query || customer.name.toLowerCase().includes(query) || customer.country.name.toLowerCase().includes(query)));

            return rows.sort((a, b) => (this.sortDescending ? b.balance - a.balance : a.balance - b.balance));
        },
        totalBalance() {
            return this.rows.reduce((sum, customer) => sum + customer.balance, 0);
        },
        sortIcon() {
            return this.sortDescending ? 'pi pi-sort-amount-down' : 'pi pi-sort-amount-up-alt';
        }
    },
    methods: {
        open(customer) {
            this.selected = customer;
            this.sheetVisible = true;
        },
        notify(action) {
            this.$toast.add({ severity: 'info', summary: action, detail: `${this.selected.name} (demo only)`, life: 3000 });
        },
        initials(name) {
            return name
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('');
        },
        formatCurrency(value) {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
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

                default:
                    return null;
            }
        }
    }
};
</script>
