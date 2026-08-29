<script>
export default {
    props: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        jsonLd: { type: Object, default: null },
        type: { type: String, default: 'article' }
    },
    setup(props) {
        const route = useRoute();

        useSeo({
            title: props.title,
            description: props.description,
            path: route.path,
            type: props.type,
            jsonLd: props.jsonLd
        });

        return () => null;
    }
};
</script>
