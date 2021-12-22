<template>
    <TemplateRoot class="root">
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
            return this.$store.getters['issuedDocs/list'];
        },
        tableRows(): TableRow[] {
            return this.requestedDocuments.map((reqDoc) => ({
                ...reqDoc,
                accent: reqDoc.status
                    ? this.processStatusToAccentMap[reqDoc.status]
                    : this.processStatusToAccentMap.PROCESSING,
                handler: ({serialCode}) => {
                    if (serialCode) {
                        this.$router.push({name: 'RequestFulfill', params: {id: serialCode}});
                    }
                },
            }));
        },
    },
    created() {
        if (!this.requestedDocuments.length) {
            this.$store.dispatch('issuedDocs/fetchAll', {authToken: this.$store.getters['auth/userToken']});
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
        position   : relative;
        width      : 100%;
        border     : 1px solid $primary;
        padding    : 0;
        min-height : 400px;
        overflow-x : hidden;
    }
}
</style>
