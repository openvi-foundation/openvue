<template>
    <DocPlayground :schema="schema">
        <template #preview="{ props, child }">
            <Toolbar v-bind="props" class="w-full">
                <template v-if="child.start" #start>
                    <Button icon="pi pi-plus" class="mr-2" severity="secondary" text />
                    <Button icon="pi pi-print" class="mr-2" severity="secondary" text />
                    <Button icon="pi pi-upload" severity="secondary" text />
                </template>

                <template v-if="child.center" #center>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText placeholder="Search" />
                    </IconField>
                </template>

                <template v-if="child.end" #end>
                    <Button label="Save" />
                </template>
            </Toolbar>
        </template>
    </DocPlayground>
</template>

<script>
import DocPlayground from '@/components/doc/playground/DocPlayground.vue';
import schema from './playground/schema';

export default {
    components: {
        DocPlayground
    },
    data() {
        return {
            schema
        };
    }
};
</script>
