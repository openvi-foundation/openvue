<template>
    <div class="flex min-h-screen items-center justify-center">
        <div class="flex card flex-col items-center gap-8 sm:p-20">
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-primary">
                <span class="font-bold text-9xl"> {{ digits[0] }} </span>
                <div class="flex items-center justify-center bg-primary text-primary-contrast rounded-full w-28 h-28">
                    <i class="pi pi-compass !text-6xl"></i>
                </div>
                <span class="font-bold text-9xl"> {{ digits[2] }} </span>
            </div>
            <div class="font-bold text-center text-4xl border-t border-surface pt-8">{{ message }}</div>
            <NuxtLink to="/"><Button label="GO TO HOMEPAGE" /></NuxtLink>
        </div>
    </div>
</template>

<script>
/* Nuxt renders this view for every error, not only missing pages. Naming the real status keeps a
   transient runtime failure from being indexed as "Page Not Found", and the noindex tag keeps any
   error view out of search results altogether. */
export default {
    props: {
        error: {
            type: Object,
            default: null
        }
    },
    setup(props) {
        const statusCode = Number(props.error?.statusCode) || 500;

        useHead({
            title: statusCode === 404 ? 'Page Not Found | OpenVue' : `Error ${statusCode} | OpenVue`,
            meta: [{ name: 'robots', content: 'noindex,nofollow' }]
        });
    },
    computed: {
        statusCode() {
            return Number(this.error?.statusCode) || 500;
        },
        digits() {
            return String(this.statusCode).padStart(3, '0');
        },
        message() {
            return this.statusCode === 404 ? 'Page Not Found' : 'Something went wrong';
        }
    }
};
</script>
