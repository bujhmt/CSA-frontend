<template>
    <section>
        <Header/>
        <slot></slot>
    </section>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Header from '@/components/navigation/header.vue';

export default defineComponent({
    name: 'DefaultLayout',
    components: {Header},
});

</script>
