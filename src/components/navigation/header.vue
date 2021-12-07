<template>
    <header>
        <nav>
            <div class="primary-block">
                <Logo class="logo"/>
                <span class="app-subtitle">Твоя Цифрова Країна</span>
            </div>
            <div v-if="isAuthenticated" class="links">
                <router-link
                    v-for="(link, index) in links"
                    :to="link.url"
                    :key="`${index}-${link.label}`"
                >
                    {{ link.label }}
                </router-link>
            </div>
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
        isAuthenticated(): boolean {
            return this.$store.getters['auth/isAuthed'];
        },
        links(): MenuLink[] {
            return [
                {
                    label: 'Login',
                    url: '/login',
                },
                {
                    label: 'Register',
                    url: '/register',
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
        width           : 100%;
        padding         : 15px 25px;
        display         : flex;
        align-items     : center;
        justify-content : space-between;

        .links {
            display     : flex;
            align-items : center;

            > * {
                margin-right : 50px;
            }
        }
    }

    .primary-block {
        display     : flex;
        align-items : center;

        .logo {
            margin-right : 20px;
        }

        .app-subtitle {
            font-weight : 500;
            font-size   : 24px;
            line-height : 29px;
            color       : $white;
        }
    }
}
</style>
