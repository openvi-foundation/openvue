<template>
    <DocSectionText v-bind="$attrs">
        <p>A radar chart is a graphical method of displaying multivariate data in the form of a two-dimensional chart of three or more quantitative variables represented on axes starting from the same point.</p>
    </DocSectionText>
    <div class="card flex justify-center">
        <Chart type="radar" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
    </div>
    <DocSectionCode :code="code" :dependencies="{ 'chart.js': '4.5.0' }" component="Chart" />
</template>

<script>
export default {
    data() {
        return {
            chartData: {
                labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
                datasets: [
                    {
                        label: 'My First dataset',
                        data: [65, 59, 90, 81, 56, 55, 40]
                    },
                    {
                        label: 'My Second dataset',
                        data: [28, 48, 40, 19, 96, 27, 100]
                    }
                ]
            },
            chartOptions: {},
            code: {
                basic: `
<Chart type="radar" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
`,
                options: `
<template>
    <div class="card flex justify-center">
        <Chart type="radar" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
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
                labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
                datasets: [
                    {
                        label: 'My First dataset',
                        data: [65, 59, 90, 81, 56, 55, 40]
                    },
                    {
                        label: 'My Second dataset',
                        data: [28, 48, 40, 19, 96, 27, 100]
                    }
                ]
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
        <Chart type="radar" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
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
        labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        datasets: [
            {
                label: 'My First dataset',
                data: [65, 59, 90, 81, 56, 55, 40]
            },
            {
                label: 'My Second dataset',
                data: [28, 48, 40, 19, 96, 27, 100]
            }
        ]
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
