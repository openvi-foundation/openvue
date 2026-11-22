<template>
    <div class="card flex flex-col gap-8">
        <div>
            <h1 class="text-2xl font-semibold mb-2">Repro: nested overlays & outside clicks</h1>
            <p>
                Reproduces the bugs fixed by PRs
                <a href="https://github.com/openvi-foundation/openvue/pull/732" target="_blank" rel="noopener">#732</a>,
                <a href="https://github.com/openvi-foundation/openvue/pull/734" target="_blank" rel="noopener">#734</a> and
                <a href="https://github.com/openvi-foundation/openvue/pull/737" target="_blank" rel="noopener">#737</a>. The
                <strong>Panel</strong> badge next to each case shows whether the outer component's panel is open right now.
            </p>
        </div>

        <section v-for="c in cases" :key="c.id" class="flex flex-col gap-3 border border-surface rounded-lg p-4">
            <div class="flex items-center gap-3 flex-wrap">
                <h2 class="text-xl font-semibold m-0">{{ c.title }}</h2>
                <Tag :value="'Panel: ' + (open[c.id] ? 'open' : 'closed')" :severity="open[c.id] ? 'success' : 'secondary'" />
                <a :href="c.issue" target="_blank" rel="noopener" class="text-sm">issue</a>
            </div>
            <ol class="list-decimal ml-6 my-0">
                <li v-for="(step, i) in c.steps" :key="i">{{ step }}</li>
            </ol>
            <p class="m-0"><strong>Expected:</strong> {{ c.expected }}</p>
            <p class="m-0"><strong>Actual on master:</strong> {{ c.actual }}</p>

            <!-- #731: Select inside Select -->
            <Select v-if="c.id === 'select'" v-model="selectValue" :options="fruits" placeholder="Outer Select" class="w-72" @show="open.select = true" @hide="open.select = false">
                <template #header>
                    <div class="p-3 flex flex-col gap-2" data-repro="nested">
                        <span class="text-sm">Nested Select:</span>
                        <Select v-model="nestedValues.select" :options="colors" placeholder="Pick a color" class="w-full" />
                    </div>
                </template>
            </Select>

            <!-- #733: Select inside CascadeSelect -->
            <CascadeSelect
                v-else-if="c.id === 'cascade'"
                v-model="cascadeValue"
                :options="countries"
                optionLabel="cname"
                optionGroupLabel="name"
                :optionGroupChildren="['states', 'cities']"
                placeholder="Outer CascadeSelect"
                class="w-72"
                @show="open.cascade = true"
                @hide="open.cascade = false"
            >
                <template #footer>
                    <div class="p-3 flex flex-col gap-2" data-repro="nested">
                        <span class="text-sm">Nested Select:</span>
                        <Select v-model="nestedValues.cascade" :options="colors" placeholder="Pick a color" class="w-full" />
                    </div>
                </template>
            </CascadeSelect>

            <!-- #736: Select inside TreeSelect -->
            <TreeSelect v-else-if="c.id === 'tree-nested'" v-model="treeValue1" :options="nodes" placeholder="Outer TreeSelect" class="w-72" @show="open['tree-nested'] = true" @hide="open['tree-nested'] = false">
                <template #footer>
                    <div class="p-3 flex flex-col gap-2" data-repro="nested">
                        <span class="text-sm">Nested Select:</span>
                        <Select v-model="nestedValues.tree" :options="colors" placeholder="Pick a color" class="w-full" />
                    </div>
                </template>
            </TreeSelect>

            <!-- #735: TreeSelect needs two outside clicks -->
            <TreeSelect v-else-if="c.id === 'tree-double'" v-model="treeValue2" :options="nodes" placeholder="Outer TreeSelect" class="w-72" @show="open['tree-double'] = true" @hide="open['tree-double'] = false">
                <template #footer>
                    <div class="p-3 text-sm border-t border-surface" data-repro="footer">Click this footer text, then click outside.</div>
                </template>
            </TreeSelect>

            <!-- review finding: a nested overlay that emits overlay-click on click (DatePicker) -->
            <TreeSelect v-else-if="c.id === 'tree-datepicker'" v-model="treeValue3" :options="nodes" placeholder="Outer TreeSelect" class="w-72" @show="open['tree-datepicker'] = true" @hide="open['tree-datepicker'] = false">
                <template #footer>
                    <div class="p-3 flex flex-col gap-2" data-repro="nested">
                        <span class="text-sm">Nested DatePicker:</span>
                        <DatePicker v-model="nestedValues.date" placeholder="Pick a date" class="w-full" />
                    </div>
                </template>
            </TreeSelect>

            <!-- review finding: aria-expanded="true" that is not an overlay -->
            <MultiSelect v-else-if="c.id === 'multi-panel'" v-model="multiValue" :options="fruits" placeholder="Outer MultiSelect" class="w-72" @show="open['multi-panel'] = true" @hide="open['multi-panel'] = false">
                <template #header>
                    <Panel header="Help" toggleable class="m-3" data-repro="panel">
                        <p class="m-0 text-sm">This Panel is expanded, so its toggle button has aria-expanded="true".</p>
                    </Panel>
                </template>
            </MultiSelect>

            <p v-if="c.nestedKey" class="m-0 text-sm text-muted-color">Nested value: {{ nestedValues[c.nestedKey] ?? 'none' }}</p>
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {
            open: { select: false, cascade: false, 'tree-nested': false, 'tree-double': false, 'tree-datepicker': false, 'multi-panel': false },
            selectValue: null,
            cascadeValue: null,
            treeValue1: null,
            treeValue2: null,
            treeValue3: null,
            multiValue: null,
            nestedValues: { select: null, cascade: null, tree: null, date: null },
            fruits: ['Apple', 'Banana', 'Cherry'],
            colors: ['Red', 'Green', 'Blue'],
            countries: [
                {
                    name: 'Australia',
                    states: [
                        { name: 'New South Wales', cities: [{ cname: 'Sydney' }, { cname: 'Newcastle' }] },
                        { name: 'Queensland', cities: [{ cname: 'Brisbane' }, { cname: 'Townsville' }] }
                    ]
                },
                {
                    name: 'Canada',
                    states: [
                        { name: 'Ontario', cities: [{ cname: 'Toronto' }, { cname: 'Ottawa' }] },
                        { name: 'Quebec', cities: [{ cname: 'Montreal' }, { cname: 'Quebec City' }] }
                    ]
                }
            ],
            nodes: [
                {
                    key: '0',
                    label: 'Documents',
                    children: [
                        { key: '0-0', label: 'Work' },
                        { key: '0-1', label: 'Home' }
                    ]
                },
                { key: '1', label: 'Events' },
                { key: '2', label: 'Movies' }
            ],
            cases: [
                {
                    id: 'select',
                    nestedKey: 'select',
                    title: '1. Select inside a Select header',
                    issue: 'https://github.com/openvi-foundation/openvue/issues/731',
                    steps: ['Open the outer Select.', 'Open the nested Select in its header.', 'Pick a color.'],
                    expected: 'The color is selected and the outer Select stays open.',
                    actual: 'The outer Select closes as soon as you pick a color.'
                },
                {
                    id: 'cascade',
                    nestedKey: 'cascade',
                    title: '2. Select inside a CascadeSelect footer',
                    issue: 'https://github.com/openvi-foundation/openvue/issues/733',
                    steps: ['Open the CascadeSelect.', 'Open the nested Select in its footer.', 'Pick a color.'],
                    expected: 'The color is selected and the CascadeSelect stays open.',
                    actual: 'The CascadeSelect closes as soon as you pick a color.'
                },
                {
                    id: 'tree-nested',
                    nestedKey: 'tree',
                    title: '3. Select inside a TreeSelect footer',
                    issue: 'https://github.com/openvi-foundation/openvue/issues/736',
                    steps: [
                        'Open the TreeSelect.',
                        'Click the nested Select in its footer and pick any color. The TreeSelect stays open, but only by accident: the click on the nested Select trigger hits bug #735 (case 4), and its stale flag swallows the option click.',
                        'With the nested Select still focused, press Enter to open it with the keyboard.',
                        'Click another color.'
                    ],
                    expected: 'The color is selected and the TreeSelect stays open.',
                    actual: 'The TreeSelect closes as soon as you pick the color in step 4.'
                },
                {
                    id: 'tree-double',
                    title: '4. TreeSelect needs two outside clicks',
                    issue: 'https://github.com/openvi-foundation/openvue/issues/735',
                    steps: ['Open the TreeSelect.', 'Click the footer text inside the panel (not a tree node).', 'Click once anywhere outside the panel.'],
                    expected: 'The first outside click closes the panel.',
                    actual: 'The first outside click is ignored; you need a second one.'
                },
                {
                    id: 'tree-datepicker',
                    nestedKey: 'date',
                    title: '5. DatePicker inside a TreeSelect footer (found in review)',
                    issue: 'https://github.com/openvi-foundation/openvue/pull/737',
                    steps: ['Open the TreeSelect.', 'Open the nested DatePicker and pick a date (the DatePicker closes).', 'Click once anywhere outside the TreeSelect panel.'],
                    expected: 'Picking a date keeps the TreeSelect open, and the first outside click closes it.',
                    actual: 'With PR #737, the first outside click is ignored, because DatePicker emits overlay-click on click and leaves a stale flag.'
                },
                {
                    id: 'multi-panel',
                    title: '6. Expanded Panel inside a MultiSelect header (found in review)',
                    issue: 'https://github.com/openvi-foundation/openvue/issues/719',
                    steps: ['Open the MultiSelect.', 'Click once anywhere outside its panel.'],
                    expected: 'The MultiSelect closes.',
                    actual: 'It never closes, because the expanded Panel toggle has aria-expanded="true" and is taken for an open nested overlay.'
                }
            ]
        };
    }
};
</script>
