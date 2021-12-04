<template>
    <header>
        <nav>
            <Logo class="logo"/>
            <router-link
                v-for="(link, index) in links"
                :to="link.url"
                :key="`${index}-${link.label}`"
            >
                {{ link.label }}
            </router-link>
        </nav>
    </header>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {MenuLink} from '@/interfaces/menu-link';
import Logo from '@/components/navigation/logo.vue';

export default defineComponent({
    name: 'Header',
    components: {Logo},
    computed: {
        links(): MenuLink[] {
            return [
                {
                    label: 'Login',
                    url: '/login',
                },
            ];
        },
    },
});

</script>

<style scoped lang="scss">
@import "src/assets/colors";

header {
    position   : fixed;
    top        : 0;
    width      : 100%;
    background : $primary-darken;
    max-height : 80px;

    nav {
        width       : 100%;
        padding     : 15px 50px;
        display     : flex;
        align-items : center;
    }

    .logo {
        margin-right : 20px;
    }
}
</style>
