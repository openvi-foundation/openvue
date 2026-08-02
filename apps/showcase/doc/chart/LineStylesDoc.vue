<template>
    <DocSectionText v-bind="$attrs">
        <p>Various styles of a line series can be customized to display customizations like an area chart.</p>
    </DocSectionText>
    <div class="card">
        <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
    </div>
    <DocSectionCode :code="code" :dependencies="{ 'chart.js': '4.5.0' }" component="Chart" />
</template>

<script>
export default {
    data() {
        return {
            chartData: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'First Dataset',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Second Dataset',
                        data: [28, 48, 40, 19, 86, 27, 90],
                        fill: false,
                        borderDash: [5, 5],
                        tension: 0.4
                    },
                    {
                        label: 'Third Dataset',
                        data: [12, 51, 62, 33, 21, 62, 45],
                        fill: true,
                        tension: 0.4,
                        backgroundColor: 'rgba(107, 114, 128, 0.2)'
                    }
                ]
            },
            chartOptions: {
                maintainAspectRatio: false,
                aspectRatio: 0.6
            },
            code: {
                basic: `
<Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
`,
                options: `
<template>
    <div class="card">
        <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
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
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'First Dataset',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Second Dataset',
                        data: [28, 48, 40, 19, 86, 27, 90],
                        fill: false,
                        borderDash: [5, 5],
                        tension: 0.4
                    },
                    {
                        label: 'Third Dataset',
                        data: [12, 51, 62, 33, 21, 62, 45],
                        fill: true,
                        tension: 0.4,
                        backgroundColor: 'rgba(107, 114, 128, 0.2)'
                    }
                ]
            };
        },
        setChartOptions() {
            return {
                maintainAspectRatio: false,
                aspectRatio: 0.6
            };
        }
    }
};
<\/script>
`,
                composition: `
<template>
    <div class="card">
        <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
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
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                tension: 0.4
            },
            {
                label: 'Second Dataset',
                data: [28, 48, 40, 19, 86, 27, 90],
                fill: false,
                borderDash: [5, 5],
                tension: 0.4
            },
            {
                label: 'Third Dataset',
                data: [12, 51, 62, 33, 21, 62, 45],
                fill: true,
                tension: 0.4,
                backgroundColor: 'rgba(107, 114, 128, 0.2)'
            }
        ]
    };
};
const setChartOptions = () => {
    return {
        maintainAspectRatio: false,
        aspectRatio: 0.6
    };
}
<\/script>
`
            }
        };
    }
};
</script>
