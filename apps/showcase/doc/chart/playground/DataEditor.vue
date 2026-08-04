<template>
    <div>
        <div class="overflow-x-auto pb-1">
            <!-- point types carry one column group per series, category types a single value column -->
            <div class="grid w-fit items-center gap-x-3 gap-y-2" :style="columns" role="group" aria-label="Chart data">
                <span class="text-xs font-semibold uppercase tracking-wider text-muted-color">{{ pointType ? '#' : 'Label' }}</span>

                <div v-for="(series, s) in data.series" :key="`h${s}`" class="flex min-w-0 items-center gap-2" :style="pointType ? { gridColumn: `span ${fields.length}` } : null">
                    <span class="size-2.5 shrink-0 rounded-full bg-surface-300 dark:bg-surface-600" :style="swatchStyle(s)" aria-hidden="true"></span>
                    <InputText v-model="series.label" size="small" fluid class="min-w-0" :aria-label="`Name of series ${s + 1}`" />
                    <Button icon="pi pi-times" text rounded severity="secondary" size="small" :disabled="data.series.length === 1" :aria-label="`Remove series ${s + 1}`" @click="$emit('remove-series', s)" />
                </div>

                <Button icon="pi pi-plus" text rounded severity="secondary" size="small" :disabled="data.series.length >= maxSeries" aria-label="Add series" @click="$emit('add-series')" />

                <template v-if="pointType">
                    <span></span>
                    <template v-for="(series, s) in data.series" :key="`f${s}`">
                        <span v-for="field in fields" :key="`f${s}${field}`" class="text-xs uppercase tracking-wider text-muted-color">{{ field }}</span>
                    </template>
                    <span></span>
                </template>

                <template v-for="(row, r) in rowCount" :key="r">
                    <template v-if="pointType">
                        <span class="text-sm tabular-nums text-muted-color">{{ r + 1 }}</span>
                        <template v-for="(series, s) in data.series" :key="`p${r}${s}`">
                            <InputNumber v-for="field in fields" :key="`p${r}${s}${field}`" v-model="series.points[r][field]" size="small" fluid :aria-label="`${series.label} point ${r + 1} ${field}`" />
                        </template>
                    </template>
                    <template v-else>
                        <InputText v-model="data.labels[r]" size="small" fluid :aria-label="`Label for row ${r + 1}`" />
                        <InputNumber v-for="(series, s) in data.series" :key="`${r}-${s}`" v-model="series.values[r]" size="small" fluid :aria-label="`${series.label} at ${data.labels[r]}`" />
                    </template>
                    <Button icon="pi pi-times" text rounded severity="secondary" size="small" :disabled="rowCount === 1" :aria-label="`Remove row ${r + 1}`" @click="$emit('remove-row', r)" />
                </template>
            </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-2 border-t border-surface pt-4">
            <Button :label="pointType ? 'Add point' : 'Add row'" icon="pi pi-plus" size="small" severity="secondary" outlined @click="$emit('add-row')" />
        </div>
    </div>
</template>

<script>
import { MAX_SERIES, isPointType, pointFields } from './options';

const LABEL_COLUMN = '9rem';
const VALUE_COLUMN = '10rem';
const POINT_COLUMN = '6rem';
const ACTION_COLUMN = '2.5rem';

export default {
    name: 'DataEditor',
    /*
     * Like the control panel, the editor writes into the data object it is handed. Structural
     * changes are emitted instead, since adding or removing a row has to stay in step with both
     * the category values and the point coordinates.
     */
    props: {
        type: {
            type: String,
            required: true
        },
        data: {
            type: Object,
            required: true
        },
        palette: {
            type: Array,
            default: () => []
        }
    },
    emits: ['add-row', 'remove-row', 'add-series', 'remove-series'],
    computed: {
        maxSeries: () => MAX_SERIES,
        pointType() {
            return isPointType(this.type);
        },
        fields() {
            return pointFields(this.type);
        },
        rowCount() {
            return this.pointType ? this.data.series[0].points.length : this.data.labels.length;
        },
        columns() {
            const perSeries = this.pointType ? this.fields.length : 1;
            const width = this.pointType ? POINT_COLUMN : VALUE_COLUMN;

            return { gridTemplateColumns: `${LABEL_COLUMN} repeat(${this.data.series.length * perSeries}, ${width}) ${ACTION_COLUMN}` };
        }
    },
    methods: {
        swatchStyle(index) {
            const color = this.palette[index % this.palette.length];

            // the placeholder class shows until the palette resolves on the client
            return color ? { backgroundColor: color } : null;
        }
    }
};
</script>
