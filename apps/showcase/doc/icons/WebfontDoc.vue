<template>
    <DocSectionText v-bind="$attrs">
        <p>Once the stylesheet is imported, reference an icon by class on an element such as <i>i</i> or <i>span</i>.</p>
    </DocSectionText>
    <div class="card flex justify-center items-center gap-4">
        <i class="oi oi-check"></i>
        <i class="oi oi-spin oi-spinner"></i>
        <i class="oi oi-search" style="font-size: 1.5rem; color: var(--p-primary-color)"></i>
    </div>
    <DocSectionCode :code="code" hideToggleCode hideStackBlitz />
    <DocSectionText>
        <p>Icons inherit <i>font-size</i> and <i>color</i> from their parent, so they scale with the surrounding text. The <i>oi-fw</i> class gives an icon a fixed width, which is useful for aligning lists of menu items.</p>
    </DocSectionText>
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
<i class="oi oi-check"></i>
<i class="oi oi-spin oi-spinner"></i>
<i class="oi oi-search" style="font-size: 1.5rem; color: var(--p-primary-color)"></i>
`
            }
        };
    }
};
</script>
