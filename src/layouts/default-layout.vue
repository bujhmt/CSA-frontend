<template>
    <main>
        <Header/>
        <slot></slot>
    </main>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Header from '@/components/navigation/header.vue';

export default defineComponent({
    name: 'DefaultLayout',
    components: {Header},
});

</script>

<style scoped lang="scss">
main {
    display    : flex;
    position   : relative;
    width      : 100%;
}
</style>
