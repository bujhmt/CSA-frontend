<template>
    <table>
        <tbody>
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
            :class="row.accent"
            @click="handleRow(index)"
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
        </tbody>
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
    methods: {
        handleRow(index: number) {
            return this.rows[index]?.handler?.(this.rows[index]);
        },
    },
});

</script>

<style scoped lang="scss">
@import 'src/assets/colors';

table {
    position    : absolute;
    top         : 0;
    left        : 0;
    overflow    : auto;
    width       : 100%;
    display     : block;
    white-space : nowrap;
    height      : 100%;

    tbody {
        display : table;
        width   : 100%;
    }

    th, td {
        text-align  : left;
        padding     : 15px 24px;
        white-space : break-spaces;
    }

    tr {
        border-bottom : 1px solid $primary;
        transition    : background 0.3s ease;
        cursor        : pointer;

        &.success {
            background : $green;

            &:hover {
                background : darken($green, 10);
            }
        }

        &.danger {
            background : $red;

            &:hover {
                background : darken($red, 10);
            }
        }

        &.info {
            background : $grey-lighten;

            &:hover {
                background : darken($grey-lighten, 10);
            }
        }
    }

    th {
        font-weight : 600;
        font-size   : 20px;
        line-height : 26px;
        height      : 30px;
    }
}
</style>
