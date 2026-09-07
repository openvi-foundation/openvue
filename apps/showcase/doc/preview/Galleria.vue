<template>
    <Galleria :value="images" :numVisible="3" :showItemNavigators="false" containerStyle="max-width: 11rem">
        <template #item="slotProps">
            <img :src="slotProps.item.src" :alt="slotProps.item.alt" style="width: 100%; display: block" />
        </template>
        <template #thumbnail="slotProps">
            <img :src="slotProps.item.src" :alt="slotProps.item.alt" style="width: 3rem; display: block" />
        </template>
    </Galleria>
</template>

<script>
export default {
    data() {
        return {
            images: [
                { src: '/demo/images/preview/shot-2.svg', alt: 'Blue' },
                { src: '/demo/images/preview/shot-1.svg', alt: 'Green' },
                { src: '/demo/images/preview/shot-3.svg', alt: 'Orange' }
            ]
        };
    }
};
</script>
