<template>
    <DocSectionText v-bind="$attrs">
        <p>
            A chart is configured with the <i>type</i> and <i>data</i> properties. Chart type is defined using the <i>type</i> property that accepts <i>pie</i>, <i>doughnut</i>, <i>line</i>, <i>bar</i>, <i>radar</i> and <i>polarArea</i> as a value.
            The <i>data</i> defines the datasets represented with the chart.
        </p>
        <p>
            Colors, fonts and grid lines come from the design tokens of the active theme, so a chart matches the rest of your UI without configuration and follows preset and dark mode changes as they happen. Use the <i>options</i>
            property to customize the presentation; anything you set there takes precedence over the theme defaults.
        </p>
    </DocSectionText>
    <div class="card">
        <Chart type="bar" :data="chartData" />
    </div>
    <DocSectionCode :code="code" :dependencies="{ 'chart.js': '4.5.0' }" component="Chart" />
</template>

<script>
export default {
    data() {
        return {
            chartData: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [
                    {
                        label: 'Sales',
                        data: [540, 325, 702, 620]
                    }
                ]
            },
            code: {
                basic: `
<Chart type="bar" :data="chartData" />
`,
                options: `
<template>
    <div class="card">
        <Chart type="bar" :data="chartData" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            chartData: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [
                    {
                        label: 'Sales',
                        data: [540, 325, 702, 620]
                    }
                ]
            }
        };
    }
};
<\/script>
`,
                composition: `
<template>
    <div class="card">
        <Chart type="bar" :data="chartData" />
    </div>
</template>

<script setup>
import { ref } from "vue";

const chartData = ref({
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
        {
            label: 'Sales',
            data: [540, 325, 702, 620]
        }
    ]
});
<\/script>
`
            }
        };
    }
};
</script>
