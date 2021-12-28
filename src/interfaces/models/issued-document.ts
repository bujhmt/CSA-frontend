import {ProcessStatus} from '@/enums/process-status';
// eslint-disable-next-line import/no-cycle
import {User} from '@/interfaces/models/user';

export interface IssuedDocument {
    type: string;
    actType?: string;
    status?: ProcessStatus;
    requestDate?: string;
    serialCode: number;
    processedDate?: string;
    requester?: Partial<User>;
    processedResult?: string;
}
