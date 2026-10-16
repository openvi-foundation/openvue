<template>
    <DocSectionText v-bind="$attrs">
        <p>Key distinctions to notice between the OpenVolt Button and the OpenVue Button.</p>
    </DocSectionText>
    <ul class="list-disc list-inside leading-8">
        <li>The <i class="mark">severity</i> prop is not utilized in OpenVolt, Use the semantic buttons such as ContrastButton instead of the contrast severity. OpenVolt provides four common severities compared to the wider range of OpenVue.</li>
        <li>The <i class="mark">badgeSeverity</i> is not used, the fixed style is provided by the <i class="mark">pcBadge</i> section instead.</li>
    </ul>
</template>

<script setup lang="ts"></script>
