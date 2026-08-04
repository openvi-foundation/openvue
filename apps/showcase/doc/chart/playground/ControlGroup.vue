<template>
    <section class="flex flex-col gap-3 p-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-muted-color">{{ title }}</p>
        <slot />
    </section>
</template>

<script>
export default {
    name: 'ControlGroup',
    props: {
        title: {
            type: String,
            required: true
        }
    }
};
</script>
