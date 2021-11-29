<template>
    <DefaultLayout>
        <router-view/>
    </DefaultLayout>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import DefaultLayout from '@/layouts/default-layout.vue';

    @Options({
        components: {DefaultLayout},
        name: 'App',
    })
export default class App extends Vue {

}
</script>
<style lang="scss" scoped>

</style>
