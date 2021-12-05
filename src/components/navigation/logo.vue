<template>
    <MaybeLink :to="to" tag="div">
        <img src="/logo.svg" alt="logo">
    </MaybeLink>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {RouteLocationNormalized} from 'vue-router';
import MaybeLink from '@/components/common/maybe-link.vue';

export default defineComponent({
    name: 'Logo',
    components: {MaybeLink},
    data() {
        return {
            isMainPage: this.$route.path === '/',
        };
    },
    computed: {
        to(): string | null {
            return this.isMainPage ? null : '/';
        },
    },
    watch: {
        $route(currentRoute: RouteLocationNormalized) {
            this.isMainPage = currentRoute.path === '/';
        },
    },
});

</script>

<style scoped lang="scss">

</style>
