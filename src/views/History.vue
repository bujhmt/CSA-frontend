<template>
    <TemplateRoot class="root">
        <Breadcrumbs :links="breadcrumbs" class="breadcrumbs"/>
        <div class="filters">
            <div class="pagination">
                <span>
                    Сторінка
                    <strong>
                        {{ page > countOfPages ? countOfPages : page }} / {{ countOfPages }}
                    </strong>
                </span>
                <SelectInput
                    :values="rolesItems"
                    @selected="changeRole"
                    class="select-input"
                />
                <div class="num-inputs-wrapper">
                    <NumberInput
                        :min="1"
                        :initial-value="page"
                        placeholder="Cторінка"
                        label="Cторінка"
                        @end="changePage"
                        class="page-input"
                    />
                    <NumberInput
                        :min="1"
                        :max="100"
                        placeholder="Розмір сторінки"
                        label="Розмір сторінки"
                        @end="changeTake"
                        class="take-input"
                    />
                </div>
            </div>
            <div class="text-inputs-wrapper">
                <TextInput
                    placeholder="Пошук по імені"
                    label="Пошук по імені"
                    @end="changeName"
                />
                <TextInput
                    placeholder="Пошук по назві"
                    label="Пошук по назві"
                    @end="changeType"
                />
            </div>
        </div>
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
import {ActionLog} from '@/interfaces/models/action-log';
import {UserRole} from '@/enums/user-role';
import {TableColumn} from '@/interfaces/table/table-column';
import {TableRow} from '@/interfaces/table/table-row';
import {TableAccent} from '@/enums/table-accent';
import Card from '@/components/block/card.vue';
import AccentTable from '@/components/block/accent-table/accent-table.vue';
import SelectInput from '@/components/forms/select-input.vue';
import {SelectItem} from '@/interfaces/inputs/select-item';
import NumberInput from '@/components/forms/number-input.vue';
import TextInput from '@/components/forms/text-input.vue';
import Breadcrumbs from '@/components/common/breadcrumbs.vue';
import {BreadcrumbLink} from '@/interfaces/breadcrumbs-link';

const INITIAL_STEP = 10;

export default defineComponent({
    name: 'History',
    components: {
        Breadcrumbs,
        TextInput,
        NumberInput,
        SelectInput,
        AccentTable,
        Card,
        TemplateRoot,
    },
    data() {
        const tableColumns: TableColumn[] = [
            {
                title: 'Дата створення',
                key: 'date',
            },
            {
                title: 'Користувач',
                key: 'name',
            },
            {
                title: 'Дія',
                key: 'type',
            },
        ];

        const rolesItems: SelectItem[] = [
            {
                value: null,
                title: 'Всі',
            },
            {
                value: UserRole.USER,
                title: 'Користувач',
            },
            {
                value: UserRole.REGISTER,
                title: 'Реєстратор',
            },
        ];

        const breadcrumbs: BreadcrumbLink[] = [
            {
                url: '/admin',
                text: 'Головна',
            },
            {
                url: '/history',
                text: 'Історія',
            },
        ];

        return {
            page: 1,
            take: INITIAL_STEP,
            name: null as string | null,
            role: null as UserRole | null,
            type: null as string | null,
            tableColumns,
            rolesItems,
            loading: false,
            breadcrumbs,
        };
    },
    computed: {
        actionLogs(): ActionLog[] {
            return this.$store.getters['action-logs/list'];
        },
        actionLogsTotal(): number {
            return this.$store.getters['action-logs/total'];
        },
        authToken(): string {
            return this.$store.getters['auth/userToken'];
        },
        tableRows(): TableRow[] {
            return this.actionLogs.map(({user, ...data}) => ({
                ...data,
                name: user.name || user.login,
                accent: TableAccent.INFO,
                handler: ({id}) => {
                    this.$router.push({name: 'ActionLog', params: {id}});
                },
            }));
        },
        countOfPages(): number {
            return Math.ceil(this.actionLogsTotal / this.take);
        },
    },
    methods: {
        fetchLogs(): Promise<void> {
            this.loading = true;

            return this.$store.dispatch('action-logs/fetchList', {
                authToken: this.authToken,
                take: this.take,
                skip: this.take * (this.page - 1),
                name: this.name ? this.name : undefined,
                role: this.role ? this.role : undefined,
                type: this.type ? this.type : undefined,
            })
                .finally(() => {
                    this.loading = false;
                });
        },
        changeRole(role: UserRole | null) {
            this.role = role;
            this.fetchLogs();
        },
        changeTake(take: number) {
            if (take) {
                this.take = take;
                this.page = 1;
                this.fetchLogs();
            }
        },
        changeName(name: string) {
            this.name = name;
            this.fetchLogs();
        },
        changeType(type: string) {
            this.type = type;
            this.fetchLogs();
        },
        changePage(page: number) {
            if (page <= this.countOfPages) {
                this.page = page;
                this.fetchLogs();
            }
        },
    },
    created() {
        if (!this.actionLogs.length) {
            this.fetchLogs();
        }
    },
});

</script>

<style scoped lang="scss">
@import 'src/assets/colors';

.root {
    flex-direction : column;

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
