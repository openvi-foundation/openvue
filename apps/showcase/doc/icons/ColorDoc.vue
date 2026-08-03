<template>
    <DocSectionText v-bind="$attrs">
        <p>Icon color is defined with the <i>color</i> property which is inherited from parent by default.</p>
    </DocSectionText>
    <div class="card flex justify-center items-center gap-4">
        <i class="oi oi-check" style="color: slateblue"></i>
        <i class="oi oi-times" style="color: green"></i>
        <i class="oi oi-search" style="color: 'var(--p-primary-color)'"></i>
        <i class="oi oi-user" style="color: #708090"></i>
    </div>
    <DocSectionCode :code="code" hideToggleCode importCode hideStackBlitz />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
<i class="oi oi-check" style="color: slateblue"></i>
<i class="oi oi-times" style="color: green"></i>
<i class="oi oi-search" style="color: 'var(--p-primary-color)'"></i>
<i class="oi oi-user" style="color: #708090"></i>
`
            }
        };
    }
};
</script>
