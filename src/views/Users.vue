<template>
    <TemplateRoot>
        <Breadcrumbs :links="breadcrumbs" class="breadcrumbs"/>
        <div class="filters">
            <div class="pagination">
                <span>
                    Сторінка
                    <strong>{{ actionLogsTotal > 0 ? page : 0 }} / {{ countOfPages }}</strong>
                </span>
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
                    placeholder="Пошук за логіном"
                    label="Пошук за логіном"
                    @end="changeName"
                />
                <SelectInput
                    :values="rolesItems"
                    @selected="changeRole"
                    class="select-input"
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
import Breadcrumbs from '@/components/common/breadcrumbs.vue';
import {BreadcrumbLink} from '@/interfaces/breadcrumbs-link';
import Card from '@/components/block/card.vue';
import AccentTable from '@/components/block/accent-table/accent-table.vue';
import {UserRole} from '@/enums/user-role';
import {TableRow} from '@/interfaces/table/table-row';
import {TableAccent} from '@/enums/table-accent';
import {TableColumn} from '@/interfaces/table/table-column';
import {SelectItem} from '@/interfaces/inputs/select-item';
import {User} from '@/interfaces/models/user';
import SelectInput from '@/components/forms/select-input.vue';
import NumberInput from '@/components/forms/number-input.vue';
import TextInput from '@/components/forms/text-input.vue';

const INITIAL_STEP = 10;

export default defineComponent({
    name: 'Users',
    components: {
        TextInput,
        NumberInput,
        SelectInput,
        AccentTable,
        Card,
        Breadcrumbs,
        TemplateRoot,
    },
    data() {
        const breadcrumbs: BreadcrumbLink[] = [
            {
                url: '/admin',
                text: 'Головна',
            },
            {
                url: '/users',
                text: 'Користувачі',
            },
        ];

        const tableColumns: TableColumn[] = [
            {
                title: 'Логін',
                key: 'login',
            },
            {
                title: 'Роль',
                key: 'role',
            },
            {
                title: 'Кількість запитів',
                key: 'issuedDocuments',
            },
            {
                title: 'Верифіковано',
                key: 'verificated',
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

        return {
            breadcrumbs,
            page: 1,
            take: INITIAL_STEP,
            name: null as string | null,
            role: null as UserRole | null,
            type: null as string | null,
            tableColumns,
            rolesItems,
        };
    },
    computed: {
        users(): Partial<User>[] {
            return this.$store.getters['users/list'];
        },
        actionLogsTotal(): number {
            return this.$store.getters['users/total'];
        },
        authToken(): string {
            return this.$store.getters['auth/userToken'];
        },
        tableRows(): TableRow[] {
            return this.users.map(({
                isActive,
                issuedDocuments,
                passportData,
                role,
                ...data
            }) => ({
                ...data,
                role: role === UserRole.USER ? 'Користувач' : 'Реєстратор',
                issuedDocuments: (issuedDocuments?.length || 0).toString(),
                verificated: passportData ? '+' : '-',
                accent: isActive ? TableAccent.SUCCESS : TableAccent.DANGER,
                handler: ({login}) => {
                    this.$router.push({name: 'UserPage', params: {login}});
                },
            }));
        },
        countOfPages(): number {
            return Math.ceil(this.actionLogsTotal / this.take);
        },
    },
    methods: {
        fetchUsers(): Promise<void> {
            return this.$store.dispatch('users/fetchList', {
                authToken: this.authToken,
                take: this.take,
                skip: this.take * (this.page - 1),
                name: this.name ? this.name : undefined,
                role: this.role ? this.role : undefined,
            });
        },
        changeRole(role: UserRole | null) {
            this.role = role;
            this.fetchUsers();
        },
        changeTake(take: number) {
            if (take) {
                this.take = take;
                this.page = 1;
                this.fetchUsers();
            }
        },
        changeName(name: string) {
            this.name = name;
            this.fetchUsers();
        },
        changePage(page: number) {
            if (page <= this.countOfPages) {
                this.page = page;
                this.fetchUsers();
            }
        },
    },
    created() {
        if (!this.users.length) {
            this.fetchUsers();
        }
    },
});

</script>

<style scoped lang="scss">
@import 'src/assets/colors';

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

    .text-inputs-wrapper {
        flex           : 0 0 48%;
        display        : flex;
        flex-direction : column;

        .select-input {
            flex       : 0 0 45%;
            max-height : 60px;
            padding    : 8px 10px;
            margin-top : 10px;
        }
    }

    .pagination {
        display         : flex;
        justify-content : space-between;
        flex-wrap       : wrap;
        flex            : 0 0 50%;

        span {
            flex          : 0 0 50%;
            margin-bottom : 10px;

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

</style>
