<template>
    <TemplateRoot class="root">
        <Card class="main-block">
            <AccentTable
                :columns="tableColumns"
                :rows="tableRows"
            />
        </Card>
        <div class="info-block">
            <router-link to="/request" class="link">
                <Btn label="Створити запит" class="button"/>
            </router-link>
            <h2>Як це працює?</h2>
            <NumList :items="rules" class="num-list"/>
        </div>
    </TemplateRoot>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import TemplateRoot from '@/components/common/template-root.vue';
import Card from '@/components/block/card.vue';
import Btn from '@/components/block/btn.vue';
import NumList from '@/components/block/num-list/num-list.vue';
import {TableColumn} from '@/interfaces/table/table-column';
import AccentTable from '@/components/block/accent-table/accent-table.vue';
import {IssuedDocument} from '@/interfaces/models/issued-document';
import {TableRow} from '@/interfaces/table/table-row';
import {ProcessStatus} from '@/enums/process-status';
import {TableAccent} from '@/enums/table-accent';

export default defineComponent({
    name: 'HomeView',
    components: {
        AccentTable,
        NumList,
        Btn,
        Card,
        TemplateRoot,
    },
    data() {
        const processStatusToAccentMap: Record<ProcessStatus, TableAccent> = {
            [ProcessStatus.PROCESSING]: TableAccent.INFO,
            [ProcessStatus.DENIED]: TableAccent.DANGER,
            [ProcessStatus.RECEIVED]: TableAccent.SUCCESS,
            [ProcessStatus.WAITING_PAYMENT]: TableAccent.INFO,
        };

        const processStatusToLocale: Record<ProcessStatus, string> = {
            [ProcessStatus.PROCESSING]: 'Oброблюється',
            [ProcessStatus.DENIED]: 'Відмовлено',
            [ProcessStatus.RECEIVED]: 'Отримано',
            [ProcessStatus.WAITING_PAYMENT]: 'Очікує оплати',
        };

        const rules = [
            'Заповніть відповідну інформацію про себе у профілі',
            'Створіть запит на отримання витягу',
            'Завантажте та оплатіть квитанцію',
            'Зачекайте обробку запиту працівником Реєстру',
            'Зверніть увагу на поле статус: коли запит буде отримано, там буде написано “Отримано”',
        ];

        const tableColumns: TableColumn[] = [
            {
                title: 'Номер витягу',
                key: 'serialCode',
            },
            {
                title: 'Назва',
                key: 'type',
            },
            {
                title: 'Дата створення',
                key: 'requestDate',
            },
            {
                title: 'Статус',
                key: 'status',
            },
        ];

        return {
            processStatusToAccentMap,
            processStatusToLocale,
            rules,
            tableColumns,
        };
    },
    computed: {
        issuedDocuments(): IssuedDocument[] {
            return this.$store.getters['issuedDocs/list'];
        },
        tableRows(): TableRow[] {
            return this.issuedDocuments.map((issueDocument) => ({
                ...issueDocument,
                accent: issueDocument.status
                    ? this.processStatusToAccentMap[issueDocument.status]
                    : this.processStatusToAccentMap.PROCESSING,
                status: issueDocument.status
                    ? this.processStatusToLocale[issueDocument.status]
                    : this.processStatusToLocale[ProcessStatus.PROCESSING],
                handler: (value) => {
                    console.log(value);
                },
            }));
        },
    },
    created() {
        if (!this.issuedDocuments.length) {
            this.$store.dispatch('issuedDocs/fetchAll');
        }
    },
});

</script>

<style lang="scss" scoped>
@import 'src/assets/colors';
@import 'src/assets/breakpoints';

.root {
    display : flex;

    .main-block {
        position     : relative;
        max-width    : calc(100% - 305px);
        width        : 100%;
        border       : 1px solid $primary;
        margin-right : 25px;
        padding      : 0;
        min-height   : 400px;
        overflow-x   : hidden;
    }

    .info-block {
        flex           : 0 0 280px;
        display        : flex;
        flex-direction : column;
        align-items    : center;

        .link {
            width     : 100%;
            max-width : 350px;
        }

        .button {
            width         : 100%;
            margin-bottom : 20px;
        }
    }
}

@media (max-width : $md) {
    .root {
        flex-direction  : column;
        justify-content : flex-start;

        .main-block {
            max-width : none;
        }

        .info-block {
            margin-top : 30px;

            .num-list {
                width : 100%;
            }
        }
    }
}
</style>
