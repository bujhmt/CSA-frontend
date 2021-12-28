<template>
    <TemplateRoot>
        <Breadcrumbs :links="breadcrumbs"/>
        <div class="cards-wrapper" v-if="user">
            <Card class="info-card">
                <span class="block">Загальні дані</span>

            </Card>
            <Card class="buttons-card">
                <Btn
                    :disabled="reason.length < 6"
                    :label="this.user.isActive ? 'Заблокувати' : 'Розблокувати'"
                    class="button"
                    :accent="this.user.isActive ? 'danger' : 'default'"
                    @click="handleChangeStatus"
                />
                <TextInput
                    :placeholder="this.user.isActive
                    ? 'Причина блокування'
                    : 'Причина розблокування'"
                    :label="this.user.isActive ? 'Причина блокування' : 'Причина розблокування'"
                    :validators="reasonValidators"
                    @value="handleReasonInput"
                    textarea
                />
            </Card>
        </div>
    </TemplateRoot>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {BreadcrumbLink} from '@/interfaces/breadcrumbs-link';
import TemplateRoot from '@/components/common/template-root.vue';
import Breadcrumbs from '@/components/common/breadcrumbs.vue';
import Card from '@/components/block/card.vue';
import Btn from '@/components/block/btn.vue';
import TextInput from '@/components/forms/text-input.vue';
import {Validator} from '@/interfaces/types/validator';
import {$post} from '@/plugins/axios';
import {User} from '@/interfaces/models/user';

export default defineComponent({
    name: 'UserPage',
    components: {
        TextInput,
        Btn,
        Card,
        Breadcrumbs,
        TemplateRoot,
    },
    data() {
        const reasonValidators: Validator<string>[] = [
            (value) => value.length > 5,
        ];

        return {
            reasonValidators,
            reason: '',
        };
    },
    computed: {
        login(): string {
            return this.$route.params.login as string;
        },
        user(): Partial<User> | undefined {
            return this.$store.getters['users/byLogin'](this.login);
        },
        breadcrumbs(): BreadcrumbLink[] {
            return [
                {
                    url: '/admin',
                    text: 'Головна',
                },
                {
                    url: '/users',
                    text: 'Користувачі',
                },
                {
                    url: `/users/${this.login}`,
                    text: this.login,
                },
            ];
        },
    },
    methods: {
        fetchUser(): Promise<void> {
            return this.$store.dispatch('users/fetchById', {
                login: this.login,
                authToken: this.$store.getters['auth/userToken'],
            });
        },
        handleReasonInput(reason: string) {
            this.reason = reason;
        },
        handleChangeStatus() {
            $post(
                this.user?.isActive ? '/user/deactivate' : '/user/activate',
                {
                    auth: this.$store.getters['auth/userToken'],
                    body: {
                        login: this.login,
                        reason: this.reason,
                    },
                },
            ).then((response) => {
                if (response?.success) {
                    this.fetchUser();
                    this.reason = '';
                }
            });
        },
    },
    created() {
        if (!this.user) {
            this.fetchUser();
        }
    },
});

</script>

<style scoped lang="scss">
@import 'src/assets/colors';

.cards-wrapper {
    position        : relative;
    display         : flex;
    justify-content : space-between;
    margin-top      : 20px;

    .info-card {
        flex        : 0 0 60%;
        display     : flex;
        flex-wrap   : wrap;
        align-items : stretch;

        span, strong {
            display       : block;
            flex          : 0 0 50%;
            margin-bottom : 15px;
        }

        div {
            flex           : 0 0 100%;
            display        : flex;
            flex-direction : column;

            > * {
                margin-top : 15px;
            }
        }

        .block {
            font-weight : 600;
            font-size   : 22px;
            flex        : 0 0 100%;

            &:not(:first-of-type) {
                margin-top : 20px;
            }
        }

        strong {
            font-weight : 600;
        }
    }

    .buttons-card {
        flex           : 0 0 25%;
        display        : flex;
        flex-direction : column;
        margin-left    : 20px;
        padding        : 20px 10px;

        .button {
            width         : 100%;
            margin-bottom : 20px;
            margin-top    : 20px;
        }
    }
}

</style>
