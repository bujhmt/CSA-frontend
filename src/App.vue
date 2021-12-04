<template>
    <DefaultLayout>
        <router-view/>
    </DefaultLayout>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import DefaultLayout from '@/layouts/default-layout.vue';

export default defineComponent({
    name: 'App',
    components: {DefaultLayout},
});

</script>
<style lang="scss" >
@import "assets/styles";

</style>
