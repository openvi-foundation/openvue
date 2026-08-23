<template>
    <Dialog :visible="true" :modal="false" :draggable="false" :closable="false" appendTo="self">
        <div class="flex flex-col gap-3">
            <span class="text-sm">Are you sure?</span>
            <div class="flex justify-end gap-2">
                <Button label="No" size="small" severity="secondary" outlined />
                <Button label="Yes" size="small" />
            </div>
        </div>
    </Dialog>
</template>
