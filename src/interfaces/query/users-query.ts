import {PaginationQuery} from '@/interfaces/query/pagination-query';

export interface UsersQuery extends PaginationQuery {
    name?: string;
}
