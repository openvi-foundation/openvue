<template>
    <DocSectionText v-bind="$attrs">
        <p>A bar chart is rendered horizontally when <i>indexAxis</i> option is set as <i>y</i>.</p>
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
                        label: 'My First dataset',
                        data: [65, 59, 80, 81, 56, 55, 40]
                    },
                    {
                        label: 'My Second dataset',
                        data: [28, 48, 40, 19, 86, 27, 90]
                    }
                ]
            },
            chartOptions: {
                indexAxis: 'y',
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                scales: {
                    x: {
                        ticks: {
                            font: {
                                weight: 500
                            }
                        },
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        }
                    },
                    y: {
                        border: {
                            display: false
                        }
                    }
                }
            },
            code: {
                basic: `
<Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]"  />
`,
                options: `
<template>
    <div class="card">
        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]"  />
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
                        label: 'My First dataset',
                        data: [65, 59, 80, 81, 56, 55, 40]
                    },
                    {
                        label: 'My Second dataset',
                        data: [28, 48, 40, 19, 86, 27, 90]
                    }
                ]
            };
        },
        setChartOptions() {
            return {
                indexAxis: 'y',
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                scales: {
                    x: {
                        ticks: {
                            font: {
                                weight: 500
                            }
                        },
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        }
                    },
                    y: {
                        border: {
                            display: false
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
    <div class="card">
        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]"  />
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
                label: 'My First dataset',
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'My Second dataset',
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };
};
const setChartOptions = () => {
    return {
        indexAxis: 'y',
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        scales: {
            x: {
                ticks: {
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false
                },
                border: {
                    display: false
                }
            },
            y: {
                border: {
                    display: false
                }
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
