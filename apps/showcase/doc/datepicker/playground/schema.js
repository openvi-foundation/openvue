import { closingScript } from '@/components/doc/playground/serialize';
import { defineSchema } from '@/components/doc/playground/schema';

/* the picker binds a date, or a list of them once the rail says so */
const BINDINGS = ['v-model="date"'];

const template = (tag) => `<template>
    <div class="card flex justify-center">
        ${tag}
    </div>
</template>`;

export default defineSchema({
    component: 'DatePicker',
    groups: [
        {
            title: 'Behaviour',
            controls: [
                'selectionMode',
                'dateFormat',
                'updateModelType',
                'showOtherMonths',
                'selectOtherMonths',
                { prop: 'iconDisplay', when: (state) => state.showIcon },
                { prop: 'icon', when: (state) => state.showIcon },
                { prop: 'numberOfMonths', min: 1, max: 4 },
                'view',
                { prop: 'maxDateCount', when: (state) => state.selectionMode === 'multiple' },
                'showOnFocus',
                'showButtonBar',
                'shortYearCutoff',
                'showTime',
                'timeOnly',
                { prop: 'hourFormat', when: (state) => state.showTime || state.timeOnly },
                { prop: 'stepHour', when: (state) => state.showTime || state.timeOnly, min: 1 },
                { prop: 'stepMinute', when: (state) => state.showTime || state.timeOnly, min: 1 },
                { prop: 'stepSecond', when: (state) => state.showTime && state.showSeconds, min: 1 },
                { prop: 'showSeconds', when: (state) => state.showTime || state.timeOnly },
                'hideOnDateTimeSelect',
                'hideOnRangeSelection',
                { prop: 'timeSeparator', when: (state) => state.showTime || state.timeOnly },
                'showWeek',
                'manualInput'
            ]
        },
        {
            title: 'Appearance',
            controls: ['inline', 'breakpoint', 'showClear', 'size', 'variant', 'placeholder', 'inputClass', 'panelClass', 'fluid']
        },
        {
            title: 'State',
            controls: ['invalid', 'disabled', 'readonly', 'unstyled']
        },
        {
            title: 'Icons',
            controls: ['showIcon', 'prevIcon', 'nextIcon', 'incrementIcon', 'decrementIcon']
        },
        {
            title: 'Identity',
            controls: ['name', 'autoZIndex', 'baseZIndex', 'appendTo', 'inputId', 'ariaLabelledby', 'ariaLabel']
        }
    ],
    snippet: {
        bindings: BINDINGS,
        build: ({ tag }) => {
            return {
                options: `${template(tag)}

<script>
export default {
    data() {
        return {
            date: null
        };
    }
};
${closingScript}`,
                composition: `${template(tag)}

<script setup>
import { ref } from 'vue';

const date = ref(null);
${closingScript}`
            };
        }
    }
});
