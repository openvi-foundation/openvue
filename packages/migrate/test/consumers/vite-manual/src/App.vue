<template>
    <main :data-testid="surfaceReady ? 'ready' : 'loading'">
        <h1>Vite manual migration contract</h1>
        <Toast />
        <ConfirmDialog group="dialog" />
        <ConfirmPopup group="popup" />
        <DynamicDialog />

        <section class="actions">
            <Button v-ripple data-testid="show-toast" label="Toast" icon="pi pi-check" @click="showToast" />
            <Button data-testid="show-confirm" label="Confirm" severity="secondary" @click="showConfirm" />
            <Button data-testid="show-confirm-popup" label="Confirm popup" severity="secondary" @click="showConfirmPopup" />
            <Button v-tooltip.top="'Open dialog'" data-testid="show-dialog" label="Dialog" severity="help" @click="dialogVisible = true" />
            <Button data-testid="show-dynamic" label="Dynamic" @click="showDynamicDialog" />
            <Button data-testid="show-popover" label="Popover" @click="togglePopover" />
            <OverlayBadge value="2"><Avatar label="OV" /></OverlayBadge>
            <i v-badge="'2'" class="pi pi-bell" aria-label="Badge directive"></i>
        </section>

        <Dialog v-model:visible="dialogVisible" header="OpenVue dialog" modal><p>Dialog content</p></Dialog>
        <Popover ref="popover"><p data-testid="popover-content">Positioned overlay</p></Popover>

        <div v-focustrap><InputText aria-label="Focus trap input" /></div>
        <Button v-styleclass="{ selector: '#styleclass-target', toggleClass: 'openvue-contract' }" label="StyleClass directive" />
        <div id="styleclass-target" v-animateonscroll="{ enterClass: 'openvue-contract' }">Directive target</div>

        <Form v-slot="$form" :resolver="resolver" @submit="submitForm">
            <FormField v-slot="$field" name="username" initial-value="">
                <InputText v-bind="$field.props" data-testid="form-input" placeholder="Required name" />
                <Message v-if="$form.username?.invalid" data-testid="form-error" severity="error">{{ $form.username.error?.message }}</Message>
            </FormField>
            <Button data-testid="submit-form" type="submit" label="Validate" />
        </Form>

        <Tabs value="0">
            <TabList><Tab value="0">Inputs</Tab><Tab value="1">Data</Tab></TabList>
            <TabPanels>
                <TabPanel value="0">
                    <FloatLabel><InputText id="name" v-model="name" /><label for="name">Name</label></FloatLabel>
                    <Select v-model="selected" :options="options" option-label="label" placeholder="Select" />
                    <Checkbox v-model="checked" binary input-id="checked" /><label for="checked">Checked</label>
                    <Slider v-model="amount" />
                </TabPanel>
                <TabPanel value="1">
                    <InputText v-model="filters.global.value" data-testid="table-filter" placeholder="Filter products" />
                    <DataTable v-model:filters="filters" data-testid="product-table" :value="products" :global-filter-fields="['name']" paginator :rows="2">
                        <Column field="name" header="Name" sortable />
                        <Column field="price" header="Price" sortable />
                    </DataTable>
                </TabPanel>
            </TabPanels>
        </Tabs>

        <Accordion value="0">
            <AccordionPanel value="0"><AccordionHeader>Panel</AccordionHeader><AccordionContent>OpenVue content</AccordionContent></AccordionPanel>
        </Accordion>

        <section class="surface-compositions" aria-label="Canonical dependent component compositions">
            <CheckboxGroup name="checks"><Checkbox input-id="check-alpha" value="alpha" /></CheckboxGroup>
            <RadioButtonGroup name="radios"><RadioButton input-id="radio-alpha" value="alpha" /></RadioButtonGroup>
            <InputGroup><InputGroupAddon>@</InputGroupAddon><InputText /></InputGroup>
            <DataTable :value="products">
                <ColumnGroup type="header"
                    ><Row><Column header="Grouped product" /></Row
                ></ColumnGroup>
                <Column field="name" />
            </DataTable>
            <TreeTable :value="treeNodes"><Column field="label" header="Tree node" /></TreeTable>
            <Accordion value="legacy"><AccordionTab header="Legacy accordion" value="legacy">Legacy content</AccordionTab></Accordion>
            <TabView><TabPanel header="Legacy tab" value="legacy">Legacy tab content</TabPanel></TabView>
            <Splitter><SplitterPanel>First</SplitterPanel><SplitterPanel>Second</SplitterPanel></Splitter>
            <Stepper value="1">
                <StepList><Step value="1">First</Step></StepList>
                <StepPanels><StepPanel value="1">Step panel</StepPanel></StepPanels>
            </Stepper>
            <Stepper value="1"
                ><StepItem value="1"><Step>Vertical</Step><StepPanel>Vertical panel</StepPanel></StepItem></Stepper
            >
        </section>

        <IconGallery />
        <ComponentGallery :components="surfaceComponents" />
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import Form from '@primevue/forms/form';
import FormField from '@primevue/forms/formfield';
import { z } from 'zod';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import AccordionContent from 'primevue/accordioncontent';
import AccordionHeader from 'primevue/accordionheader';
import AccordionPanel from 'primevue/accordionpanel';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import CheckboxGroup from 'primevue/checkboxgroup';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmPopup from 'primevue/confirmpopup';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import DynamicDialog from 'primevue/dynamicdialog';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Message from 'primevue/message';
import OverlayBadge from 'primevue/overlaybadge';
import Popover from 'primevue/popover';
import RadioButton from 'primevue/radiobutton';
import RadioButtonGroup from 'primevue/radiobuttongroup';
import Row from 'primevue/row';
import Select from 'primevue/select';
import Slider from 'primevue/slider';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Step from 'primevue/step';
import StepItem from 'primevue/stepitem';
import StepList from 'primevue/steplist';
import StepPanel from 'primevue/steppanel';
import StepPanels from 'primevue/steppanels';
import Stepper from 'primevue/stepper';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';
import TabView from 'primevue/tabview';
import Toast from 'primevue/toast';
import TreeTable from 'primevue/treetable';
import { FilterMatchMode } from '@primevue/core/api';
import { useConfirm } from 'primevue/useconfirm';
import { useDialog } from 'primevue/usedialog';
import { useStyle } from 'primevue/usestyle';
import { useToast } from 'primevue/usetoast';
import { usePrimeVue } from 'primevue/config';
import IconGallery from './IconGallery.vue';
import ComponentGallery from './ComponentGallery.vue';
import DialogPayload from './DialogPayload.vue';
import { loadPublicSurface, type SurfaceComponent } from './surface';

const toast = useToast();
const confirm = useConfirm();
const dialog = useDialog();
const primevue = usePrimeVue();
const name = ref('OpenVue');
const checked = ref(true);
const amount = ref(40);
const selected = ref();
const dialogVisible = ref(false);
const surfaceReady = ref(false);
const surfaceComponents = ref<SurfaceComponent[]>([]);
const popover = ref<InstanceType<typeof Popover>>();
const options = [{ label: 'Alpha' }, { label: 'Beta' }];
const products = [
    { name: 'Zed keyboard', price: 49 },
    { name: 'Alpha mouse', price: 29 }
];
const treeNodes = [{ key: '0', data: { label: 'Root' }, children: [{ key: '0-0', data: { label: 'Leaf' } }] }];
const filters = ref({ global: { value: '', matchMode: FilterMatchMode.CONTAINS } });
const resolver = zodResolver(z.object({ username: z.string().min(1, 'Name is required') }));

useStyle('.openvue-contract { display: block; }', { name: 'openvue-contract' });
void dialog;
void primevue;

function showToast() {
    toast.add({ severity: 'success', summary: 'Migrated', detail: 'Toast service works', life: 2000 });
}

function showConfirm() {
    confirm.require({ group: 'dialog', message: 'Does confirmation work?', header: 'OpenVue confirmation' });
}

function showConfirmPopup(event: Event) {
    confirm.require({ group: 'popup', target: event.currentTarget as HTMLElement, message: 'Does the popup work?' });
}

function showDynamicDialog() {
    dialog.open(DialogPayload, { props: { header: 'Dynamic service', modal: true } });
}

function togglePopover(event: Event) {
    popover.value?.toggle(event);
}

function submitForm() {}

onMounted(async () => {
    surfaceComponents.value = await loadPublicSurface();
    surfaceReady.value = true;
});
</script>

<style scoped>
main {
    display: grid;
    gap: 1rem;
    padding: 2rem;
}
.actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}
.surface-compositions {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
}
</style>
