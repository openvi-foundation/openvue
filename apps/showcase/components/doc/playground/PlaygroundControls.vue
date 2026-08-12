<template>
    <!-- the panel is a filled rail flush with the preview, so its own edge is the only border it draws -->
    <!-- the rail keeps one width in and out of full screen: the extra room belongs to the preview, and a rail that resizes under you loses your place in the list -->
    <aside class="flex w-full shrink-0 flex-col border-t border-surface lg:h-full lg:w-[21rem] lg:border-l lg:border-t-0" :aria-label="`${schema.component} properties`">
        <!-- no panel heading: the group headers name what the rail is, and the row it would cost is worth more to the list -->
        <div class="max-h-96 flex-1 overflow-y-auto lg:max-h-none">
            <!-- a full property list is long, so the later groups start folded and the rail opens on the common ones -->
            <ControlGroup v-for="(group, index) in visibleGroups" :key="group.title" :title="group.title" :defaultOpen="index < openGroupCount" collapsible>
                <ControlRow v-for="control in group.controls" :key="control.prop" :controlId="`${idPrefix}-${control.prop}`" :label="control.label" :description="control.description" :modified="isModified(control)" v-slot="{ id }">
                    <ToggleSwitch v-if="control.control === 'boolean'" :inputId="id" v-model="state[control.prop]" />

                    <Select v-else-if="control.control === 'select'" :id="id" v-model="state[control.prop]" :options="control.options" :placeholder="control.default == null ? 'Default' : ''" size="small" showClear fluid />

                    <InputNumber v-else-if="control.control === 'number'" :inputId="id" v-model="state[control.prop]" :min="control.min ?? 0" :max="control.max" :step="control.step" size="small" fluid />

                    <InputText v-else :id="id" v-model="state[control.prop]" size="small" placeholder="None" fluid />
                </ControlRow>
            </ControlGroup>
        </div>

        <!-- outside the scroll area so it stays reachable however long the list of controls gets -->
        <div class="shrink-0 border-t border-surface p-2.5">
            <Button label="Reset to defaults" severity="secondary" outlined size="small" fluid @click="$emit('reset')" />
        </div>
    </aside>
</template>

<script>
import ControlGroup from './ControlGroup.vue';
import ControlRow from './ControlRow.vue';
import { isActive } from './schema';

export default {
    name: 'PlaygroundControls',
    components: {
        ControlGroup,
        ControlRow
    },
    emits: ['reset'],
    /*
     * The panel edits the state object it is handed rather than emitting a replacement for every
     * keystroke. The object is owned by the playground and has no other writer, so a single shared
     * instance keeps the bindings to a plain v-model.
     */
    props: {
        schema: {
            type: Object,
            required: true
        },
        state: {
            type: Object,
            required: true
        },
        idPrefix: {
            type: String,
            required: true
        },
        openGroupCount: {
            type: Number,
            default: 2
        }
    },
    computed: {
        /*
         * A control with a `when` predicate belongs to another prop — a dropdown's mode means
         * nothing without the dropdown — so it leaves the rail entirely rather than sitting there
         * disabled. A group left with no controls goes with it.
         */
        visibleGroups() {
            return this.schema.groups
                .map((group) => ({
                    title: group.title,
                    controls: group.controls.filter((control) => !control.when || control.when(this.state))
                }))
                .filter((group) => group.controls.length);
        }
    },
    methods: {
        /* The predicate codegen uses, so a marked row and a line in the generated snippet cannot disagree. */
        isModified(control) {
            return isActive(control, this.state);
        }
    }
};
</script>
