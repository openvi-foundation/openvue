<template>
    <DocSectionText v-bind="$attrs">
        <p>Special <i>oi-spin</i> class applies infinite rotation to an icon.</p>
    </DocSectionText>
    <div class="card flex justify-center gap-4">
        <i class="oi oi-spin oi-spinner" style="font-size: 2rem"></i>
        <i class="oi oi-spin oi-cog" style="font-size: 2rem"></i>
    </div>
    <DocSectionCode :code="code" hideToggleCode importCode hideStackBlitz />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
<i class="oi oi-spin oi-spinner" style="font-size: 2rem"></i>
<i class="oi oi-spin oi-cog" style="font-size: 2rem"></i>
`
            }
        };
    }
};
</script>
