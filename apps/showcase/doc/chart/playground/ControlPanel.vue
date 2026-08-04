<template>
    <!-- the panel is a filled rail flush with the chart, so the divider between groups is drawn by the container -->
    <aside class="w-full shrink-0 divide-y divide-surface border-t border-surface bg-surface-50 lg:w-72 lg:border-l lg:border-t-0 dark:bg-surface-800" aria-label="Chart options">
        <ControlGroup title="Chart">
            <ControlRow controlId="pg-type" label="Type" v-slot="{ id }">
                <Select :id="id" v-model="state.type" :options="chartTypes" optionLabel="label" optionValue="value" size="small" fluid />
            </ControlRow>

            <ControlRow controlId="pg-themed" label="Themed" v-slot="{ id }">
                <ToggleSwitch :inputId="id" v-model="state.themed" />
            </ControlRow>

            <ControlRow controlId="pg-title" label="Title" v-slot="{ id }">
                <InputText :id="id" v-model="state.title" size="small" placeholder="None" fluid />
            </ControlRow>
        </ControlGroup>

        <ControlGroup title="Presentation">
            <ControlRow controlId="pg-legend" label="Legend" v-slot="{ id }">
                <Select :id="id" v-model="state.legend" :options="legendPositions" optionLabel="label" optionValue="value" size="small" fluid />
            </ControlRow>

            <ControlRow v-if="cartesian" controlId="pg-grid" label="Grid lines" v-slot="{ id }">
                <ToggleSwitch :inputId="id" v-model="state.grid" />
            </ControlRow>

            <template v-if="state.type === 'bar'">
                <ControlRow controlId="pg-stacked" label="Stacked" v-slot="{ id }">
                    <ToggleSwitch :inputId="id" v-model="state.stacked" />
                </ControlRow>
                <ControlRow controlId="pg-horizontal" label="Horizontal" v-slot="{ id }">
                    <ToggleSwitch :inputId="id" v-model="state.horizontal" />
                </ControlRow>
            </template>

            <template v-if="state.type === 'line'">
                <ControlRow controlId="pg-fill" label="Fill area" v-slot="{ id }">
                    <ToggleSwitch :inputId="id" v-model="state.fill" />
                </ControlRow>
                <ControlRow controlId="pg-tension" label="Curve" :value="state.tension" stacked v-slot="{ id }">
                    <Slider :id="id" v-model="state.tension" :min="0" :max="0.5" :step="0.05" />
                </ControlRow>
            </template>

            <ControlRow v-if="state.type === 'doughnut'" controlId="pg-cutout" label="Cutout" :value="`${state.cutout}%`" stacked v-slot="{ id }">
                <Slider :id="id" v-model="state.cutout" :min="0" :max="90" :step="5" />
            </ControlRow>
        </ControlGroup>

        <ControlGroup v-if="cartesian" title="Axes">
            <ControlRow controlId="pg-xtitle" label="X title" v-slot="{ id }">
                <InputText :id="id" v-model="state.xTitle" size="small" placeholder="None" fluid />
            </ControlRow>

            <ControlRow controlId="pg-ytitle" label="Y title" v-slot="{ id }">
                <InputText :id="id" v-model="state.yTitle" size="small" placeholder="None" fluid />
            </ControlRow>

            <!-- both bounds share a row, since a range reads as one setting even though Chart.js takes two -->
            <ControlRow controlId="pg-ymin" label="Y range" v-slot="{ id }">
                <div class="flex w-full gap-2">
                    <InputNumber :inputId="id" v-model="state.yMin" size="small" placeholder="Min" aria-label="Y axis minimum" fluid />
                    <InputNumber v-model="state.yMax" size="small" placeholder="Max" aria-label="Y axis maximum" fluid />
                </div>
            </ControlRow>
        </ControlGroup>

        <ControlGroup title="Behaviour">
            <ControlRow controlId="pg-tooltip" label="Tooltip" v-slot="{ id }">
                <Select :id="id" v-model="state.tooltipMode" :options="tooltipModes" optionLabel="label" optionValue="value" size="small" fluid />
            </ControlRow>

            <ControlRow controlId="pg-animation" label="Animation" v-slot="{ id }">
                <ToggleSwitch :inputId="id" v-model="state.animation" />
            </ControlRow>
        </ControlGroup>
    </aside>
</template>

<script>
import ControlGroup from './ControlGroup.vue';
import ControlRow from './ControlRow.vue';
import { CHART_TYPES, LEGEND_POSITIONS, TOOLTIP_MODES, isCartesian } from './options';

export default {
    name: 'ControlPanel',
    components: {
        ControlGroup,
        ControlRow
    },
    /*
     * The panel edits the configuration object it is handed rather than emitting a replacement for
     * every keystroke. The object is owned by the playground and has no other reader, so a single
     * shared instance keeps the bindings to a plain v-model.
     */
    props: {
        config: {
            type: Object,
            required: true
        }
    },
    computed: {
        state() {
            return this.config;
        },
        cartesian() {
            return isCartesian(this.config.type);
        },
        chartTypes: () => CHART_TYPES,
        legendPositions: () => LEGEND_POSITIONS,
        tooltipModes: () => TOOLTIP_MODES
    }
};
</script>
