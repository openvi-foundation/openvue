<template>
    <DocSectionText v-bind="$attrs">
        <p>Polar area charts are similar to pie charts, but each segment has the same angle - the radius of the segment differs depending on the value.</p>
    </DocSectionText>
    <div class="card flex justify-center">
        <Chart type="polarArea" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
    </div>
    <DocSectionCode :code="code" :dependencies="{ 'chart.js': '4.5.0' }" component="Chart" />
</template>

<script>
export default {
    data() {
        return {
            chartData: {
                datasets: [
                    {
                        data: [11, 16, 7, 3, 14],
                        label: 'My dataset'
                    }
                ],
                labels: ['Pink', 'Gray', 'Orange', 'Purple', 'Cyan']
            },
            chartOptions: {},
            code: {
                basic: `
<Chart type="polarArea" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
`,
                options: `
<template>
    <div class="card flex justify-center">
        <Chart type="polarArea" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            chartData: null,
            chartOptions: null
        };
    },
    mounted() {
        this.chartData = this.setChartData();
        this.chartOptions = this.setChartOptions();
    },
    methods: {
        setChartData() {
            return {
                datasets: [
                    {
                        data: [11, 16, 7, 3, 14],
                        label: 'My dataset'
                    }
                ],
                labels: ['Pink', 'Gray', 'Orange', 'Purple', 'Cyan']
            };
        },
        setChartOptions() {
            return {
            };
        }
    }
};
<\/script>
`,
                composition: `
<template>
    <div class="card flex justify-center">
        <Chart type="polarArea" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();
        
const setChartData = () => {
    return {
        datasets: [
            {
                data: [11, 16, 7, 3, 14],
                label: 'My dataset'
            }
        ],
        labels: ['Pink', 'Gray', 'Orange', 'Purple', 'Cyan']
    };
};
const setChartOptions = () => {
    return {
    };
}
<\/script>
`
            }
        };
    }
};
</script>
