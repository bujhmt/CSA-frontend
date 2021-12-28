<template>
    <TemplateRoot class="root">
        <Breadcrumbs :links="breadcrumbs" class="breadcrumbs"/>
        <Card v-if="user" class="info-card">
                <span class="block">Загальні дані</span>
                <span>Логін</span>
                <strong>{{user.login}}</strong>
                <span v-if="user.name">ФІО</span>
                <strong v-if="user.name">{{user.name}}</strong>
                <span>Статус</span>
                <strong>{{user.isActive ? 'Активний' : 'Заблокований'}}</strong>
                <span>Акаунт верифіковано</span>
                <strong>{{user.passportData ? 'Так' : 'Ні'}}</strong>
                <div v-if="user.passportData">
                    <span class="block">Паспортні дані</span>
                    <span>Номер документу</span>
                    <strong>{{user.passportData.document}}</strong>
                    <span>Номер запису</span>
                    <strong>{{user.passportData.record}}</strong>
                    <span>ІПН</span>
                    <strong>{{user.passportData.taxpayerIdentificationNumber}}</strong>
                </div>
        </Card>
        <Btn label="Додати акт" class="button" accent="default" @click="addAct"/>
        <Card class="main-block">
            <AccentTable
                :columns="tableColumns"
                :rows="tableRows"
            />
        </Card>
    </TemplateRoot>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import TemplateRoot from '@/components/common/template-root.vue';
import {TableColumn} from '@/interfaces/table/table-column';
import {TableRow} from '@/interfaces/table/table-row';
import {TableAccent} from '@/enums/table-accent';
import Card from '@/components/block/card.vue';
import AccentTable from '@/components/block/accent-table/accent-table.vue';
import Breadcrumbs from '@/components/common/breadcrumbs.vue';
import {BreadcrumbLink} from '@/interfaces/breadcrumbs-link';
import {UserAct} from '@/interfaces/models/user-act';
import { $get } from '@/plugins/axios';
import Btn from '@/components/block/btn.vue';
import { PassportData } from '@/interfaces/models/nested/passport-data';
import { User } from '@/interfaces/models/user';

export default defineComponent({
    name: 'UserActs',
    components: {
        Breadcrumbs,
        AccentTable,
        Card,
        TemplateRoot,
        Btn,
    },
    data() {
        const tableColumns: TableColumn[] = [
            {
                title: 'Акт Цивільного Стану',
                key: 'name',
            },
            {
                title: 'Чи є акт дійсним',
                key: 'isActive',
            },
        ];

        const breadcrumbs: BreadcrumbLink[] = [
            {
                url: '/registrator',
                text: 'Головна',
            },
            {
                url: '/user-status-list',
                text: 'Список Користувачів',
            },
            {
                url: '/user-acts',
                text: 'Акти користувача',
            },
        ];

        const acts: UserAct[] = [];

        const nameLocale: Record<string, string> = {
            nameChange: 'Зміна імені',
            marriage: 'Одруження',
            death: 'Смерть',
        };

        return {
            tableColumns,
            loading: false,
            user: null as User | null,
            breadcrumbs,
            acts,
            nameLocale,
        };
    },
    computed: {
        authToken(): string {
            return this.$store.getters['auth/userToken'];
        },
        login(): string {
            return this.$route.params.login as string;
        },
        tableRows(): TableRow[] {
            if (this.acts[0]) { console.log(this.acts[0].actType.typeName); }
            return this.acts.map(({actType, isActive, ...data}) => ({
                ...data,
                name: this.$data.nameLocale[actType.typeName],
                isActive: isActive ? '+' : '-',
                accent: isActive ? TableAccent.SUCCESS : TableAccent.DANGER,
                handler: ({id}) => {
                    this.$router.push({name: 'UserAct', params: {id}});
                },
            }));
        },
    },
    methods: {
        async fetchUser(): Promise<void> {
            $get<User>(`/user/${this.login}`, this.authToken)
                .then((response) => {
                    if (response?.success && response.data) {
                        console.log(response.data);
                        this.$data.user = response.data;
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        fetchActs(): Promise<void> {
            this.loading = true;

            return this.$store.dispatch('civil-acts/fetchList', {
                authToken: this.authToken,
                login: this.$route.params.login,
            })
                .finally(() => {
                    this.loading = false;
                });
        },
        addAct(): void {
            this.$router.push({
                name: 'AddAct',
                params: {
                    login: this.$route.params.login,
                },
            });
        },
    },
    created() {
        this.fetchUser();
        $get<UserAct[]>('/civil-act/user', this.authToken, {params: {login: this.$route.params.login}}).then((answer) => {
            if (answer && answer.success) {
                if (answer.data) { this.$data.acts = answer.data; }
            }
        });
    },
});

</script>

<style scoped lang="scss">
@import 'src/assets/colors';

.root {
    flex-direction : column;

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
            width: 100%;
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

    .button {
        width         : 100%;
        margin-bottom : 20px;
        margin-top    : 20px;
    }

    .breadcrumbs {
        margin-bottom : 20px;
    }

    .main-block {
        position        : relative;
        justify-content : center;
        align-items     : center;
        width           : 100%;
        border          : 1px solid $primary;
        padding         : 0;
        min-height      : 600px;
        overflow-x      : hidden;
    }

    .filters {
        display         : flex;
        justify-content : space-between;
        align-items     : flex-end;
        margin-bottom   : 20px;

        .select-input {
            flex       : 0 0 45%;
            max-height : 60px;
            padding    : 8px 10px;
        }

        .text-inputs-wrapper {
            flex           : 0 0 48%;
            display        : flex;
            flex-direction : column;
        }

        .pagination {
            display         : flex;
            justify-content : space-between;
            flex-wrap       : wrap;
            flex            : 0 0 50%;

            span {
                flex : 0 0 50%;

                strong {
                    font-weight : 600;
                }
            }

            .num-inputs-wrapper {
                flex            : 0 0 100%;
                display         : flex;
                justify-content : space-between;

                .page-input {
                    flex : 0 0 35%;
                }

                .take-input {
                    flex : 0 0 63%;
                }
            }
        }
    }
}

</style>
