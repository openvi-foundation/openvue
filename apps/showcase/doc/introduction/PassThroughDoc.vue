<template>
    <DocSectionText v-bind="$attrs">
        <p class="mb-0">
            Pass Through is an API that provides access to the internal DOM elements of a component to add arbitrary attributes. Traditional UI component libraries encapsulate their markup behind limited APIs, which leaves you waiting on a maintainer
            to add the prop or event you need. With <NuxtLink to="/passthrough">Pass Through</NuxtLink> that limitation is gone, since you can reach the internals of a component yourself. Common use cases are test attributes, additional aria
            attributes, custom events and styling.
        </p>
    </DocSectionText>
</template>
