<template>
    <section>
        <Header/>
        <slot></slot>
    </section>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import Header from '@/components/navigation/header.vue';

    @Options({
        name: 'DefaultLayout',
        components: {Header},
    })
export default class DefaultLayout extends Vue {

}

</script>

<style scoped lang="scss">

</style>
