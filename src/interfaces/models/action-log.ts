// eslint-disable-next-line import/no-cycle
import {User} from '@/interfaces/models/user';

export interface ActionLog {
    user: Partial<User>;
    type: string;
    date: string;
    newSnapshot: Record<string, any>;
    oldSnapshot: Record<string, any>;
    reason: string;
}
