<template>
    <DocSectionText v-bind="$attrs">
        <p>A specific message is removed with the <i>remove</i> method by passing an object with the <i>id</i> of the message. Define an <i>id</i> of your own when adding the message to be able to reference it later.</p>
    </DocSectionText>
    <div class="card flex justify-center">
        <div class="flex flex-wrap gap-2">
            <Button label="Show" @click="show()" />
            <Button label="Remove" severity="secondary" @click="remove()" />
        </div>
    </div>
    <DocSectionCode :code="code" />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
<Toast />
<Button label="Show" @click="show()" />
<Button label="Remove" severity="secondary" @click="remove()" />
`,
                options: `
<template>
    <div class="card flex justify-center">
        <Toast />
        <div class="flex flex-wrap gap-2">
            <Button label="Show" @click="show()" />
            <Button label="Remove" severity="secondary" @click="remove()" />
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        show() {
            this.$toast.add({ id: 'info-message', severity: 'info', summary: 'Info', detail: 'Message Content' });
        },
        remove() {
            this.$toast.remove({ id: 'info-message' });
        }
    }
};
<\/script>
`,
                composition: `
<template>
    <div class="card flex justify-center">
        <Toast />
        <div class="flex flex-wrap gap-2">
            <Button label="Show" @click="show()" />
            <Button label="Remove" severity="secondary" @click="remove()" />
        </div>
    </div>
</template>

<script setup>
import { useToast } from "openvue/usetoast";

const toast = useToast();

const show = () => {
    toast.add({ id: 'info-message', severity: 'info', summary: 'Info', detail: 'Message Content' });
};

const remove = () => {
    toast.remove({ id: 'info-message' });
};
<\/script>
`
            }
        };
    },
    methods: {
        show() {
            this.$toast.add({ id: 'info-message', severity: 'info', summary: 'Info', detail: 'Message Content' });
        },
        remove() {
            this.$toast.remove({ id: 'info-message' });
        }
    }
};
</script>
