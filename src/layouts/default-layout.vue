<template>
    <section>
        <Header/>
        <section class="template-root">
            <slot></slot>
        </section>
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

<style scoped lang="scss">

.template-root {
    min-height  : 100vh;
    padding-top : 80px;
}

</style>
