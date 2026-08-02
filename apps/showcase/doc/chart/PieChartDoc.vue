<template>
    <DocSectionText v-bind="$attrs">
        <p>A pie chart is a circular statistical graphic which is divided into slices to illustrate numerical proportion.</p>
    </DocSectionText>
    <div class="card flex justify-center">
        <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
    </div>
    <DocSectionCode :code="code" :dependencies="{ 'chart.js': '4.5.0' }" component="Chart" />
</template>

<script>
export default {
    data() {
        return {
            chartData: {
                labels: ['A', 'B', 'C'],
                datasets: [
                    {
                        data: [540, 325, 702]
                    }
                ]
            },
            chartOptions: {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true
                        }
                    }
                }
            },
            code: {
                basic: `
<Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
`,
                options: `
<template>
    <div class="card flex justify-center">
        <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
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
                labels: ['A', 'B', 'C'],
                datasets: [
                    {
                        data: [540, 325, 702]
                    }
                ]
            };
        },
        setChartOptions() {
            return {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true
                        }
                    }
                }
            };
        }
    }
};
<\/script>
`,
                composition: `
<template>
    <div class="card flex justify-center">
        <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
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
        labels: ['A', 'B', 'C'],
        datasets: [
            {
                data: [540, 325, 702]
            }
        ]
    };
};

const setChartOptions = () => {
    return {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true
                }
            }
        }
    };
};
<\/script>
`
            }
        };
    }
};
</script>
