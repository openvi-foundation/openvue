<template>
    <DocSectionText v-bind="$attrs">
        <p>Key distinctions to notice between the OpenVolt Dialog and the OpenVue Dialog.</p>
    </DocSectionText>
    <ul class="list-disc list-inside leading-8">
        <li>The <i class="mark">position</i> prop is not utilized in OpenVolt, only available position is the center.</li>
        <li>OpenVolt uses the Tailwind responsive width utilities to adjust the Dialog size per screen, instead of the <i class="mark">breakpoints</i> option of the OpenVue Dialog.</li>
    </ul>
</template>

<script setup lang="ts"></script>
