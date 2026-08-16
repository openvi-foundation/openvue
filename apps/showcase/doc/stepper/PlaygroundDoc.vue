<template>
    <DocPlayground :schema="schema" @update:child="onChild" @reset="clear">
        <template #preview="{ props, child }">
            <Stepper v-bind="props" v-model:value="active" class="w-full md:w-[36rem]">
                <!-- vertical is not a setting on Stepper: each step is paired with its own panel inside a StepItem -->
                <template v-if="child.layout === 'vertical'">
                    <StepItem v-for="step in steps(child)" :key="step.value" :value="step.value">
                        <Step :disabled="step.disabled">Header {{ step.label }}</Step>
                        <StepPanel v-slot="{ activateCallback }">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content {{ step.label }}</div>
                            </div>
                            <div class="flex py-6 gap-2">
                                <Button v-if="step.back" label="Back" severity="secondary" @click="activateCallback(step.back)" />
                                <Button v-if="step.next" label="Next" @click="activateCallback(step.next)" />
                            </div>
                        </StepPanel>
                    </StepItem>
                </template>

                <template v-else>
                    <StepList>
                        <Step v-for="step in steps(child)" :key="step.value" :value="step.value" :disabled="step.disabled">Header {{ step.label }}</Step>
                    </StepList>
                    <StepPanels>
                        <StepPanel v-for="step in steps(child)" :key="step.value" v-slot="{ activateCallback }" :value="step.value">
                            <div class="flex flex-col h-48">
                                <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content {{ step.label }}</div>
                            </div>
                            <div class="flex py-6 gap-2">
                                <Button v-if="step.back" label="Back" severity="secondary" @click="activateCallback(step.back)" />
                                <Button v-if="step.next" label="Next" @click="activateCallback(step.next)" />
                            </div>
                        </StepPanel>
                    </StepPanels>
                </template>
            </Stepper>
        </template>
    </DocPlayground>
</template>

<script>
import DocPlayground from '@/components/doc/playground/DocPlayground.vue';
import schema from './playground/schema';

const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

export default {
    components: {
        DocPlayground
    },
    data() {
        return {
            schema,
            active: '1'
        };
    },
    methods: {
        steps(child) {
            return Array.from({ length: child.steps }, (_, index) => ({
                value: String(index + 1),
                label: ROMAN[index] ?? index + 1,
                disabled: child.disabled && index === child.steps - 1,
                back: index > 0 ? String(index) : null,
                next: index < child.steps - 1 ? String(index + 2) : null
            }));
        },
        /* turning the count down can leave the open panel pointing at a step that no longer exists */
        onChild({ steps }) {
            if (Number(this.active) > steps) this.active = String(steps);
        },
        clear() {
            this.active = '1';
        }
    }
};
</script>
