<template>
    <!-- Drawer always teleports to body, so a left-positioned Dialog plays the panel over a dimmed page block. -->
    <div class="preview-drawer-scene">
        <Dialog :visible="true" header="Menu" :modal="false" :draggable="false" appendTo="self" position="left" class="preview-drawer">
            <p class="m-0 text-xs">Navigation</p>
        </Dialog>
    </div>
</template>
