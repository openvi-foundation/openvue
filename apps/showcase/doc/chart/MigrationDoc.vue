<template>
    <DocSectionText id="migration" label="Migrating from PrimeVue" v-bind="$attrs">
        <p>
            Existing PrimeVue chart configurations keep working without changes. The <i>data</i> and <i>options</i> you already pass are handed to Chart.js as they are, and anything you set explicitly takes precedence over the values described below.
            Two things are worth knowing before you upgrade.
        </p>

        <h3>Chart.js 4 is required</h3>
        <p>
            The peer dependency is <i>chart.js@^4.0.0</i>, so a project still on Chart.js 3 fails at install time with a peer conflict rather than breaking silently at runtime. Upgrade Chart.js first, then install OpenVue. Note that Chart.js 3 to 4
            has its own breaking changes independent of OpenVue, covered in the <a href="https://www.chartjs.org/docs/latest/migration/v4-migration.html">Chart.js v4 migration guide</a>.
        </p>

        <h3>Theming is on by default</h3>
        <p>
            The <i>themed</i> property defaults to <i>true</i>, which applies colors, fonts and grid styling from the active design tokens to any value you have not set yourself. This is why a chart matches the rest of your UI without configuration,
            but it also means a chart carried over from PrimeVue may render with different default colors than before. Set <i>themed</i> to <i>false</i> to disable it entirely and get the plain Chart.js defaults.
        </p>

        <DocSectionCode :code="code" hideToggleCode hideStackBlitz v-bind="$attrs" />

        <p>The defaults that differ from plain Chart.js, all of which apply only when you have not set the value yourself:</p>
        <ul class="leading-loose list-disc ml-6">
            <li>Series colors come from the theme palette, assigned by dataset index so a series keeps its color as other series are added or removed.</li>
            <li>The legend is hidden on a cartesian chart with a single dataset, since the surrounding copy already names it. Pie, doughnut and polar area charts always keep it.</li>
            <li>Line points are hidden until hover so a dense series reads as a line, with the hit area kept large enough to target them.</li>
            <li>Bars are capped at 48px and rounded at the data end.</li>
            <li>Grid lines are drawn on the value axis only, and axis border lines are hidden.</li>
        </ul>
    </DocSectionText>
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
<Chart type="bar" :data="data" :options="options" :themed="false" />
`
            }
        };
    }
};
</script>
