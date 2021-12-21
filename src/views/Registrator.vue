<template>
    <TemplateRoot class="root">
        <Card class="main-block">
            <AccentTable
                :columns="tableColumns"
                :rows="tableRows"
                @click="handleClick"
            />
        </Card>
    </TemplateRoot>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import TemplateRoot from '@/components/common/template-root.vue';
import Card from '@/components/block/card.vue';
import {TableColumn} from '@/interfaces/table/table-column';
import AccentTable from '@/components/block/accent-table/accent-table.vue';
import {IssuedDocument} from '@/interfaces/models/issued-document';
import {TableRow} from '@/interfaces/table/table-row';
import {ProcessStatus} from '@/enums/process-status';
import {TableAccent} from '@/enums/table-accent';

export default defineComponent({
    name: 'RegistratorView',
    components: {
        AccentTable,
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
            // {
            //     title: 'Статус',
            //     key: 'status',
            // },
        ];

        return {
            processStatusToAccentMap,
            tableColumns,
        };
    },
    computed: {
        requestedDocuments(): IssuedDocument[] {
            return this.$store.getters['registrator/list'];
        },
        tableRows(): TableRow[] {
            return this.requestedDocuments.map((reqDoc) => ({
                ...reqDoc,
                accent: reqDoc.status
                    ? this.processStatusToAccentMap[reqDoc.status]
                    : this.processStatusToAccentMap.PROCESSING,
            }));
        },
    },
    methods: {
        handleClick($event: Event) {
            const issueNum = parseInt(($event.target as HTMLBaseElement).innerText, 10);
            if (!Number.isNaN(issueNum)) {
                this.$router.push({name: 'RequestFulfill', params: { id: issueNum }});
            }
        },
    },
    created() {
        if (!this.requestedDocuments.length) {
            this.$store.dispatch('registrator/fetchAll');
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

            .button {
                max-width : 350px;
            }

            .num-list {
                width : 100%;
            }
        }
    }
}
</style>
