# Vue Chart Component

Chart components are based on Chart.js, an open source HTML5 based charting library.

## Import

```javascript
import Chart from 'openvue/chart';
```

## Accessibility

Screen Reader Chart components internally use canvas element, refer to the Chart.js accessibility guide for more information. The canvas element can be customized with canvasProps property to define aria roles and properties, in addition any content inside the component is directly passed as a child of the canvas to be able to provide fallback content like a table.

```vue
<Chart type="line" :data="data" :canvasProps="{'role': 'img', 'aria-label': 'Data'}" />
```

## Basic

A chart is configured with the type and data properties. Chart type is defined using the type property that accepts pie , doughnut , line , bar , radar and polarArea as a value. The data defines the datasets represented with the chart. Colors, fonts and grid lines come from the design tokens of the active theme, so a chart matches the rest of your UI without configuration and follows preset and dark mode changes as they happen. Use the options property to customize the presentation; anything you set there takes precedence over the theme defaults.

```vue
<Chart type="bar" :data="chartData" />
```

## Bubble

A bubble chart adds a third value to each point. Alongside x and y , the r property sets the radius of the bubble in pixels, so it is not scaled by the axes.

```vue
<Chart type="bubble" :data="chartData" :options="chartOptions" class="h-[30rem]" />
```

<details>
<summary>Composition API Example</summary>

```vue
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
```
</details>

## Chart.js

Chart component uses Chart.JS underneath so it needs to be installed as a dependency.

```vue
npm install chart.js
```

## Combo

Different chart types can be combined in the same graph usign the type option of a dataset.

```vue
<Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
```

<details>
<summary>Composition API Example</summary>

```vue
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
        
const setChartData = () => {
    return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                type: 'line',
                label: 'Dataset 1',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                data: [50, 25, 12, 48, 56, 76, 42]
            },
            {
                type: 'bar',
                label: 'Dataset 2',
                data: [21, 84, 24, 75, 37, 65, 34],
                borderColor: 'white',
                borderWidth: 2
            },
            {
                type: 'bar',
                label: 'Dataset 3',
                data: [41, 52, 24, 74, 23, 21, 32]
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
```
</details>

## Doughnut

A doughnut chart is a variant of the pie chart, with a blank center allowing for additional information about the data as a whole to be included.

```vue
<Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
```

<details>
<summary>Composition API Example</summary>

```vue
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
```
</details>

## HorizontalBarDoc

A bar chart is rendered horizontally when indexAxis option is set as y .

```vue
<Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]"  />
```

<details>
<summary>Composition API Example</summary>

```vue
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
```
</details>

## Line

A line chart or line graph is a type of chart which displays information as a series of data points called 'markers' connected by straight line segments.

```vue
<Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
```

<details>
<summary>Composition API Example</summary>

```vue
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
                tension: 0.4
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
```
</details>

## Line Styles

Various styles of a line series can be customized to display customizations like an area chart.

```vue
<Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
```

<details>
<summary>Composition API Example</summary>

```vue
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
```
</details>

## Multi Axis

Multiple axes can be added using the scales option.

```vue
<Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
```

<details>
<summary>Composition API Example</summary>

```vue
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
                label: 'Dataset 1',
                fill: false,
                yAxisID: 'y',
                tension: 0.4,
                data: [65, 59, 80, 81, 56, 55, 10]
            },
            {
                label: 'Dataset 2',
                fill: false,
                yAxisID: 'y1',
                tension: 0.4,
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };
};
const setChartOptions = () => {
    return {
        stacked: false,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left'
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    };
}
<\/script>
```
</details>

## PieChartDoc

A pie chart is a circular statistical graphic which is divided into slices to illustrate numerical proportion.

```vue
<Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
```

<details>
<summary>Composition API Example</summary>

```vue
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
```
</details>

## Polar Area

Polar area charts are similar to pie charts, but each segment has the same angle - the radius of the segment differs depending on the value.

```vue
<Chart type="polarArea" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
```

<details>
<summary>Composition API Example</summary>

```vue
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
```
</details>

## Radar

A radar chart is a graphical method of displaying multivariate data in the form of a two-dimensional chart of three or more quantitative variables represented on axes starting from the same point.

```vue
<Chart type="radar" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
```

<details>
<summary>Composition API Example</summary>

```vue
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
```
</details>

## Scatter

A scatter chart plots individual points against two value axes, so each item in data is an object with an x and a y rather than a single number.

```vue
<Chart type="scatter" :data="chartData" :options="chartOptions" class="h-[30rem]" />
```

<details>
<summary>Composition API Example</summary>

```vue
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
```
</details>

## StackedBarDoc

Bars can be stacked on top of each other when stacked option of a scale is enabled.

```vue
<Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
```

<details>
<summary>Composition API Example</summary>

```vue
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
```
</details>

## VerticalBarDoc

A bar chart or bar graph is a chart that presents grouped data with rectangular bars with lengths proportional to the values that they represent.

```vue
<Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]"  />
```

<details>
<summary>Composition API Example</summary>

```vue
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
```
</details>

## Chart

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| type | TType | - | Type of the chart. |
| data | ChartData<TType, DistributiveArray<ChartTypeRegistry[TType]["defaultDataPoint"]>, unknown> | - | Data to display. |
| options | Exclude<DeepPartial<CoreChartOptions<TType> & ElementChartOptions<TType> & PluginChartOptions<TType> & DatasetChartOptions<TType> & ScaleChartOptions<TType> & ChartTypeRegistry[TType]["chartOptions"]>, _DeepPartialArray<unknown>> | - | Options to customize the chart. |
| plugins | Plugin<TType, AnyObject>[] | - | Used to custom plugins of the chart. |
| width | number | 300 | Width of the chart in non-responsive mode. |
| height | number | 150 | Height of the chart in non-responsive mode. |
| canvasProps | CanvasHTMLAttributes | - | Used to pass all properties of the CanvasHTMLAttributes to canvas element inside the component. |
| themed | boolean | true | When enabled, colors, fonts and grid lines are derived from the active theme's design tokens and kept in sync with theme changes. Any option passed via the options property takes precedence. |
| dt | any | - | It generates scoped CSS variables using design tokens for the component. |
| pt | PassThrough<ChartPassThroughOptions> | - | Used to pass attributes to DOM elements inside the component. |
| ptOptions | any | - | Used to configure passthrough(pt) options of the component. |
| unstyled | boolean | false | When enabled, it removes component related styles in the core. |

## Pass Through Options

| Name | Type | Description |
|------|------|-------------|
| root | ChartPassThroughOptionType | Used to pass attributes to the root's DOM element. |
| canvas | ChartPassThroughOptionType | Used to pass attributes to the canvas's DOM element. |
| hooks | any | Used to manage all lifecycle hooks. |

## Theming

### CSS Classes

| Class | Description |
|-------|-------------|
| p-chart | Class name of the root element |

