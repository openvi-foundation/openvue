<template>
    <DocSectionText v-bind="$attrs">
        <p>A doughnut chart is a variant of the pie chart, with a blank center allowing for additional information about the data as a whole to be included.</p>
    </DocSectionText>
    <div class="card flex justify-center">
        <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
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
                        data: [300, 50, 100]
                    }
                ]
            },
            chartOptions: {
                plugins: {
                    legend: {
                        labels: {
                            cutout: '60%'
                        }
                    }
                }
            },
            code: {
                basic: `
<Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
`,
                options: `
<template>
    <div class="card flex justify-center">
        <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            chartData: null,
            chartOptions: {
                cutout: '60%'
            }
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
                            cutout: '60%'
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
        <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref(null);

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
                    cutout: '60%'
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
