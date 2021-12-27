import {User} from '@/interfaces/user';

export interface ActionLog {
    user: Partial<User>;
    type: string;
    date: string;
    newSnapshot: Record<string, any>;
    oldSnapshot: Record<string, any>;
}
