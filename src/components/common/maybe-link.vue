<template>
    <component :is="currentTag" :to="to">
        <slot></slot>
    </component>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'MaybeLink',
    props: {
        to: {
            required: true,
            type: String,
        },
        tag: {
            required: false,
            type: String,
            default: 'span',
        },
    },
    computed: {
        currentTag(): string {
            return this.to ? 'router-link' : this.tag;
        },
    },
});

</script>
