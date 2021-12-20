<template>
    <header>
        <nav>
            <div class="primary-block">
                <Logo class="logo"/>
                <span class="app-subtitle">Твоя Цифрова Країна</span>
            </div>
            <div v-if="isAuthenticated" class="links">
                <MaybeLink
                    v-for="(link, index) in links"
                    :to="link.url"
                    :key="`${index}-${link.label}`"
                    @click="link.action"
                    class="menu-item"
                >
                    {{ link.label }}
                </MaybeLink>
            </div>
        </nav>
    </header>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {MenuLink} from '@/interfaces/menu-link';
import Logo from '@/components/navigation/logo.vue';
import MaybeLink from '@/components/common/maybe-link.vue';

export default defineComponent({
    name: 'Header',
    components: {MaybeLink, Logo},
    computed: {
        isAuthenticated(): boolean {
            return this.$store.getters['auth/isAuthed'];
        },
        links(): MenuLink[] {
            const role = this.$store.getters['auth/userRole'];
            if (role === 'USER') {
                return [
                    {
                        label: 'Запит',
                        url: '/request',
                    },
                    {
                        label: 'Профіль',
                        url: '/profile',
                    },
                    {
                        label: 'Вийти',
                        action: () => {
                            this.$store.dispatch('auth/signOut');
                            this.$router.push({path: '/login'});
                        },
                    },
                ];
            }
            if (role === 'REGISTER') {
                return [{
                    label: 'Запити',
                    url: '/registrator',
                }];
            }
            return [];
        },
    },
});

</script>

<style scoped lang="scss">
@import 'src/assets/colors';
@import 'src/assets/breakpoints';

header {
    position   : fixed;
    z-index    : 1;
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
            display       : flex;
            align-items   : center;
            padding-right : 30px;

            .menu-item {
                margin-right : 20px;
                color        : $white;
                transition   : color 0.3s ease;
                cursor       : pointer;
                font-weight  : 500;

                &:hover {
                    color : $primary;
                }
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

@media (max-width : $md) {
    header {
        .primary-block {
            .app-subtitle {
                font-size   : 18px;
                line-height : 22px;
            }
        }
    }
}

@media (max-width : $sm) {
    header {
        .primary-block {
            .app-subtitle {
                display : none;
            }
        }
    }
}
</style>
