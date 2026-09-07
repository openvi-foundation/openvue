<template>
    <Dialog :visible="true" header="Delete" :modal="false" :draggable="false" appendTo="self">
        <div class="flex items-center gap-2">
            <i class="pi pi-exclamation-triangle"></i>
            <span class="text-sm">Delete this record?</span>
        </div>
    </Dialog>
</template>
