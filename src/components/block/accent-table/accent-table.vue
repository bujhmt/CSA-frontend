<template>
    <table>
        <tr>
            <th
                v-for="column in columns"
                :key="column.title"
            >
                {{ column.title }}
            </th>
        </tr>
        <tr
            v-for="(row, index) in rows"
            :key="`row-${index}`"
        >
            <td
                v-for="column in columns"
                :key="column.key"
            >
                <template v-if="row[column.key]">
                    {{ row[column.key] }}
                </template>
            </td>
        </tr>
    </table>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {TableColumn} from '@/interfaces/table/table-column';
import {TableRow} from '@/interfaces/table/table-row';

export default defineComponent({
    name: 'AccentTable',
    props: {
        columns: {
            required: true,
            type: Array as () => TableColumn[],
        },
        rows: {
            required: false,
            type: Array as () => TableRow[],
            default: () => [],
        },
    },
});

</script>

<style scoped lang="scss">
@import 'src/assets/colors';

table {
    width           : 100%;

    th, td {
        text-align : left;
        padding    : 15px 24px;
        height     : 60px;
    }

    tr {
        border-bottom : 1px solid $primary;
    }

    th {
        font-weight : 600;
        font-size   : 20px;
        line-height : 26px;
    }
}
</style>
