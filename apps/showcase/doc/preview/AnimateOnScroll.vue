<template>
    <div v-animateonscroll="{ enterClass: 'animate-fadein' }" class="flex flex-col items-center gap-2 w-full">
        <i class="pi pi-arrow-down" style="color: var(--text-secondary-color)"></i>
        <Card class="w-full">
            <template #content>
                <span class="text-sm">Animates into view</span>
            </template>
        </Card>
    </div>
</template>
