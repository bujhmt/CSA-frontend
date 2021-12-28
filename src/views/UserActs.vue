<template>
    <TemplateRoot class="root">
        <Breadcrumbs :links="breadcrumbs" class="breadcrumbs"/>
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
                url: '/user-act',
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
            breadcrumbs,
            acts,
            nameLocale,
        };
    },
    computed: {
        authToken(): string {
            return this.$store.getters['auth/userToken'];
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
        fetchActs(): Promise<void> {
            this.loading = true;

            return this.$store.dispatch('civil-acts/fetchList', {
                authToken: this.authToken,
                id: this.$route.params.id,
            })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    created() {
        console.log(this.$route.params.id);
        $get<UserAct[]>('/civil-act/user', this.authToken, {params: {userId: this.$route.params.id}}).then((answer) => {
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
