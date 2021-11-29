<template>
    <header>
        <router-link
            v-for="(link, index) in links"
            :to="link.url"
            :key="`${index}-${link.label}`"
        >
            {{ link.label }}
        </router-link>
    </header>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {MenuLink} from '@/interfaces/menu-link';

    @Options({
        name: 'Header',
        computed: {
            links(): MenuLink[] {
                return [];
            },
        },
    })
export default class Header extends Vue {
}
</script>

<style scoped lang="scss">

</style>
