<template>
    <div class="layout-footer">
        <div>
            <span>OpenVue {{ version }} on Vue 3 by Openvi Foundation</span>
        </div>
    </div>
</template>

<script>
import pkg from '@/package.json';

export default {
    data() {
        return {
            version: pkg.version
        };
    }
};
</script>
