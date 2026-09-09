<template>
    <DocSectionText v-bind="$attrs">
        <p>
            OpenVue adds design tokens as it evolves. A theme created against an earlier release is missing those tokens, which leaves the affected components falling back to unset values. The migration assistant in the Settings tab compares your
            theme against the current version of its base preset and reports what is missing.
        </p>
        <p>
            <b>Check for Updates</b> lists the missing token paths without changing anything. <b>Migrate</b> then adds them, using the base preset's value for each. It only ever adds: a token you have already customised is never overwritten, so
            migrating is safe to run at any time and does nothing on a theme that is already current.
        </p>
        <p>
            Newly added tokens carry the base theme's values, which may not suit your design. After migrating, visit the relevant sections and adjust them. Exporting a copy first is still a reasonable habit, and unlike the hosted tools this
            comparison runs entirely in your browser.
        </p>
    </DocSectionText>
</template>
