<template>
    <DocSectionText v-bind="$attrs">
        <p>Bars can be stacked on top of each other when <i>stacked</i> option of a scale is enabled.</p>
    </DocSectionText>
    <div class="card">
        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
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
                        type: 'bar',
                        label: 'Dataset 1',
                        data: [50, 25, 12, 48, 90, 76, 42]
                    },
                    {
                        type: 'bar',
                        label: 'Dataset 2',
                        data: [21, 84, 24, 75, 37, 65, 34]
                    },
                    {
                        type: 'bar',
                        label: 'Dataset 3',
                        data: [41, 52, 24, 74, 23, 21, 32]
                    }
                ]
            },
            chartOptions: {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true
                    }
                }
            },
            code: {
                basic: `
<Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
`,
                options: `
<template>
    <div class="card">
        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
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
                        type: 'bar',
                        label: 'Dataset 1',
                        data: [50, 25, 12, 48, 90, 76, 42]
                    },
                    {
                        type: 'bar',
                        label: 'Dataset 2',
                        data: [21, 84, 24, 75, 37, 65, 34]
                    },
                    {
                        type: 'bar',
                        label: 'Dataset 3',
                        data: [41, 52, 24, 74, 23, 21, 32]
                    }
                ]
            };
        },
        setChartOptions() {
            return {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    tooltips: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true
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
    <div class="card">
        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
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

const setChartData = () =>  {
    return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                type: 'bar',
                label: 'Dataset 1',
                data: [50, 25, 12, 48, 90, 76, 42]
            },
            {
                type: 'bar',
                label: 'Dataset 2',
                data: [21, 84, 24, 75, 37, 65, 34]
            },
            {
                type: 'bar',
                label: 'Dataset 3',
                data: [41, 52, 24, 74, 23, 21, 32]
            }
        ]
    };
};
const setChartOptions = () =>  {
    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            tooltips: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                stacked: true
            },
            y: {
                stacked: true
            }
        }
    };
}
<\/script>
`
            }
        };
    }
};
</script>
