<template>
    <Carousel :value="images" :numVisible="2" :numScroll="1" :showNavigators="false" containerClass="w-full">
        <template #item="slotProps">
            <div class="px-1">
                <img :src="slotProps.data.src" :alt="slotProps.data.alt" style="width: 100%; display: block; border-radius: 4px" />
            </div>
        </template>
    </Carousel>
</template>

<script>
export default {
    data() {
        return {
            images: [
                { src: '/demo/images/preview/shot-1.svg', alt: 'Green' },
                { src: '/demo/images/preview/shot-2.svg', alt: 'Blue' },
                { src: '/demo/images/preview/shot-3.svg', alt: 'Orange' }
            ]
        };
    }
};
</script>
