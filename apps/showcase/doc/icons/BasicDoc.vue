<template>
    <DocSectionText v-bind="$attrs">
        <p>OpenIcons use the <i>oi oi-&#123;icon&#125;</i> syntax such as <i>oi oi-check</i>. A standalone icon can be displayed using an element such as <i>i</i> or <i>span</i></p>
    </DocSectionText>
    <div class="card flex justify-center gap-4">
        <i class="oi oi-check"></i>
        <i class="oi oi-times"></i>
        <span class="oi oi-search"></span>
        <span class="oi oi-user"></span>
    </div>
    <DocSectionCode :code="code" hideToggleCode importCode hideStackBlitz />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
<i class="oi oi-check"></i>
<i class="oi oi-times"></i>
<span class="oi oi-search"></span>
<span class="oi oi-user"></span>
`
            }
        };
    }
};
</script>
