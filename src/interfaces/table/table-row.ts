import {TableAccent} from '@/enums/table-accent';

export interface TableRow extends Record<string, string | null | number | undefined> {
    accent: TableAccent;
}
