import {PaginationQuery} from '@/interfaces/query/pagination-query';
import {UserRole} from '@/enums/user-role';

export interface UsersQuery extends PaginationQuery {
    name?: string;
    role?: UserRole;
}
