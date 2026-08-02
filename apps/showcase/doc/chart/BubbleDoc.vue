<template>
    <DocSectionText v-bind="$attrs">
        <p>A bubble chart adds a third value to each point. Alongside <i>x</i> and <i>y</i>, the <i>r</i> property sets the radius of the bubble in pixels, so it is not scaled by the axes.</p>
    </DocSectionText>
    <div class="card">
        <Chart type="bubble" :data="chartData" :options="chartOptions" class="h-[30rem]" />
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
                        label: 'Europe',
                        data: [
                            { x: 21, y: 62, r: 14 },
                            { x: 34, y: 41, r: 22 },
                            { x: 48, y: 75, r: 9 },
                            { x: 62, y: 54, r: 18 }
                        ]
                    },
                    {
                        label: 'Americas',
                        data: [
                            { x: 27, y: 34, r: 11 },
                            { x: 41, y: 68, r: 16 },
                            { x: 55, y: 29, r: 25 },
                            { x: 70, y: 47, r: 12 }
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
                            text: 'Reach'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Engagement'
                        }
                    }
                }
            },
            code: {
                basic: `
<Chart type="bubble" :data="chartData" :options="chartOptions" class="h-[30rem]" />
`,
                options: `
<template>
    <div class="card">
        <Chart type="bubble" :data="chartData" :options="chartOptions" class="h-[30rem]" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            chartData: {
                datasets: [
                    {
                        label: 'Europe',
                        data: [
                            { x: 21, y: 62, r: 14 },
                            { x: 34, y: 41, r: 22 },
                            { x: 48, y: 75, r: 9 },
                            { x: 62, y: 54, r: 18 }
                        ]
                    },
                    {
                        label: 'Americas',
                        data: [
                            { x: 27, y: 34, r: 11 },
                            { x: 41, y: 68, r: 16 },
                            { x: 55, y: 29, r: 25 },
                            { x: 70, y: 47, r: 12 }
                        ]
                    }
                ]
            },
            chartOptions: {
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: 'Reach' } },
                    y: { title: { display: true, text: 'Engagement' } }
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
        <Chart type="bubble" :data="chartData" :options="chartOptions" class="h-[30rem]" />
    </div>
</template>

<script setup>
import { ref } from 'vue';

const chartData = ref({
    datasets: [
        {
            label: 'Europe',
            data: [
                { x: 21, y: 62, r: 14 },
                { x: 34, y: 41, r: 22 },
                { x: 48, y: 75, r: 9 },
                { x: 62, y: 54, r: 18 }
            ]
        },
        {
            label: 'Americas',
            data: [
                { x: 27, y: 34, r: 11 },
                { x: 41, y: 68, r: 16 },
                { x: 55, y: 29, r: 25 },
                { x: 70, y: 47, r: 12 }
            ]
        }
    ]
});

const chartOptions = ref({
    maintainAspectRatio: false,
    scales: {
        x: { title: { display: true, text: 'Reach' } },
        y: { title: { display: true, text: 'Engagement' } }
    }
});
<\/script>
`
            }
        };
    }
};
</script>
