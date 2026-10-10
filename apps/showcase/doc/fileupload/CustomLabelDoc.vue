<template>
    <DocSectionText v-bind="$attrs">
        <p>
            The <i>inputId</i> property is passed to the underlying native file input so that it can be associated with a custom <i>label</i>. Clicking the label opens the native file dialog, which is useful when the default header is not sufficient.
            Alternatively, the <i>empty</i> and <i>header</i> templates receive a <i>chooseCallback</i> to open the dialog programmatically, and the same functionality is available via the exposed <i>choose</i> method.
        </p>
    </DocSectionText>
    <div class="card">
        <FileUpload inputId="custom-label-upload" name="demo[]" url="/api/upload" @upload="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000">
            <template #empty="{ chooseCallback }">
                <div class="flex items-center justify-center flex-col gap-2">
                    <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
                    <p class="mt-4 mb-0">
                        Drag and drop files here or
                        <label for="custom-label-upload" class="text-primary font-semibold cursor-pointer hover:underline">browse folders</label>
                    </p>
                    <Button label="Select Images" icon="pi pi-images" @click="chooseCallback()" variant="text" size="small" />
                </div>
            </template>
        </FileUpload>
    </div>
    <DocSectionCode :code="code" />
</template>

<script>
export default {
    data() {
        return {
            code: {
                basic: `
<FileUpload inputId="custom-label-upload" name="demo[]" url="/api/upload" @upload="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000">
    <template #empty="{ chooseCallback }">
        <div class="flex items-center justify-center flex-col gap-2">
            <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
            <p class="mt-4 mb-0">
                Drag and drop files here or
                <label for="custom-label-upload" class="text-primary font-semibold cursor-pointer hover:underline">browse folders</label>
            </p>
            <Button label="Select Images" icon="pi pi-images" @click="chooseCallback()" variant="text" size="small" />
        </div>
    </template>
</FileUpload>
`,
                options: `
<template>
    <div class="card">
        <Toast />
        <FileUpload inputId="custom-label-upload" name="demo[]" url="/api/upload" @upload="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000">
            <template #empty="{ chooseCallback }">
                <div class="flex items-center justify-center flex-col gap-2">
                    <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
                    <p class="mt-4 mb-0">
                        Drag and drop files here or
                        <label for="custom-label-upload" class="text-primary font-semibold cursor-pointer hover:underline">browse folders</label>
                    </p>
                    <Button label="Select Images" icon="pi pi-images" @click="chooseCallback()" variant="text" size="small" />
                </div>
            </template>
        </FileUpload>
    </div>
</template>

<script>
export default {
    methods: {
        onUpload() {
            this.$toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
        }
    }
};
<\/script>
`,
                composition: `
<template>
    <div class="card">
        <Toast />
        <FileUpload inputId="custom-label-upload" name="demo[]" url="/api/upload" @upload="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000">
            <template #empty="{ chooseCallback }">
                <div class="flex items-center justify-center flex-col gap-2">
                    <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
                    <p class="mt-4 mb-0">
                        Drag and drop files here or
                        <label for="custom-label-upload" class="text-primary font-semibold cursor-pointer hover:underline">browse folders</label>
                    </p>
                    <Button label="Select Images" icon="pi pi-images" @click="chooseCallback()" variant="text" size="small" />
                </div>
            </template>
        </FileUpload>
    </div>
</template>

<script setup>
import { useToast } from "openvue/usetoast";
const toast = useToast();

const onUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};
<\/script>
`
            }
        };
    },
    methods: {
        onUpload() {
            this.$toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
        }
    }
};
</script>
