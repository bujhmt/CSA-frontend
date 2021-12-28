<template>
    <TemplateRoot>
        <Breadcrumbs :links="breadcrumbs"/>
        <div class="cards-wrapper" v-if="user">
            <Card class="info-card">
                <span class="block">Загальні дані</span>
                <span>Логін</span>
                <strong>{{user.login}}</strong>
                <span v-if="user.name">ФІО</span>
                <strong v-if="user.name">{{user.name}}</strong>
                <span>Роль</span>
                <strong>{{user.role === userRole.USER ? 'Користувач' : 'Реєстратор'}}</strong>
                <span>Статус</span>
                <strong>{{user.isActive ? 'Активний' : 'Заблокований'}}</strong>
                <span></span>
                <strong></strong>
                <span>Акаунт верифіковано</span>
                <strong>{{user.passportData ? 'Так' : 'Ні'}}</strong>
                <span>Запитів</span>
                <strong>
                    {{(user.issuedDocuments && user.issuedDocuments.length) || 0}}
                </strong>
                <span
                    class="block"
                    v-if="user.actionLog && user.actionLog.length"
                >
                    Історія користувача
                </span>
                <template
                    v-for="(actionLog, index) in user.actionLog"
                    :key="`${actionLog.type}-${index}`"
                >
                    <span class="block">{{index + 1}}. {{actionLog.type}}</span>
                    <span>Дата</span>
                    <strong>{{actionLog.date}}</strong>
                    <span>Причина</span>
                    <strong>{{actionLog.reason}}</strong>
                </template>
            </Card>
            <Card class="buttons-card">
                <Btn
                    :disabled="reason.length < 6"
                    :label="user.isActive ? 'Заблокувати' : 'Розблокувати'"
                    class="button"
                    :accent="user.isActive ? 'danger' : 'default'"
                    @click="handleChangeStatus"
                />
                <TextInput
                    :placeholder="user.isActive
                    ? 'Причина блокування'
                    : 'Причина розблокування'"
                    :label="user.isActive ? 'Причина блокування' : 'Причина розблокування'"
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
import {UserRole} from '@/enums/user-role';

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
            userRole: UserRole,
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
                    this.$store.dispatch('users/fetchList', {
                        authToken: this.$store.getters['auth/userToken'],
                    });
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
        flex        : 0 0 62%;
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
        flex           : 0 0 28%;
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
