import {PaginationQuery} from '@/interfaces/query/pagination-query';
import {UserRole} from '@/enums/user-role';

export interface ActionLogsQuery extends PaginationQuery {
    name?: string;
    type?: string;
    role?: UserRole;
}
