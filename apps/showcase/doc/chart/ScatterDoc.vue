<template>
    <DocSectionText v-bind="$attrs">
        <p>A scatter chart plots individual points against two value axes, so each item in <i>data</i> is an object with an <i>x</i> and a <i>y</i> rather than a single number.</p>
    </DocSectionText>
    <div class="card">
        <Chart type="scatter" :data="chartData" :options="chartOptions" class="h-[30rem]" />
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
                        label: 'Desktop',
                        data: [
                            { x: 12, y: 42 },
                            { x: 19, y: 58 },
                            { x: 24, y: 35 },
                            { x: 31, y: 71 },
                            { x: 38, y: 64 },
                            { x: 45, y: 88 }
                        ]
                    },
                    {
                        label: 'Mobile',
                        data: [
                            { x: 15, y: 24 },
                            { x: 22, y: 31 },
                            { x: 29, y: 18 },
                            { x: 36, y: 44 },
                            { x: 42, y: 39 },
                            { x: 49, y: 52 }
                        ]
                    }
                ]
            },
            chartOptions: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Session length'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Conversions'
                        }
                    }
                }
            },
            code: {
                basic: `
<Chart type="scatter" :data="chartData" :options="chartOptions" class="h-[30rem]" />
`,
                options: `
<template>
    <div class="card">
        <Chart type="scatter" :data="chartData" :options="chartOptions" class="h-[30rem]" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            chartData: {
                datasets: [
                    {
                        label: 'Desktop',
                        data: [
                            { x: 12, y: 42 },
                            { x: 19, y: 58 },
                            { x: 24, y: 35 },
                            { x: 31, y: 71 }
                        ]
                    },
                    {
                        label: 'Mobile',
                        data: [
                            { x: 15, y: 24 },
                            { x: 22, y: 31 },
                            { x: 29, y: 18 },
                            { x: 36, y: 44 }
                        ]
                    }
                ]
            },
            chartOptions: {
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: 'Session length' } },
                    y: { title: { display: true, text: 'Conversions' } }
                }
            }
        };
    }
};
<\/script>
`,
                composition: `
<template>
    <div class="card">
        <Chart type="scatter" :data="chartData" :options="chartOptions" class="h-[30rem]" />
    </div>
</template>

<script setup>
import { ref } from 'vue';

const chartData = ref({
    datasets: [
        {
            label: 'Desktop',
            data: [
                { x: 12, y: 42 },
                { x: 19, y: 58 },
                { x: 24, y: 35 },
                { x: 31, y: 71 }
            ]
        },
        {
            label: 'Mobile',
            data: [
                { x: 15, y: 24 },
                { x: 22, y: 31 },
                { x: 29, y: 18 },
                { x: 36, y: 44 }
            ]
        }
    ]
});

const chartOptions = ref({
    maintainAspectRatio: false,
    scales: {
        x: { title: { display: true, text: 'Session length' } },
        y: { title: { display: true, text: 'Conversions' } }
    }
});
<\/script>
`
            }
        };
    }
};
</script>
