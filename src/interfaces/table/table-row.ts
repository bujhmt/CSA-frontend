import {TableAccent} from '@/enums/table-accent';

export interface TableRow extends Record<string, any> {
    accent: TableAccent;
    handler?: (row: Partial<TableRow>) => void | Promise<void>,
}
