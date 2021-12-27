import {ProcessStatus} from '@/enums/process-status';
import {User} from '@/interfaces/user';

export interface IssuedDocument {
    type: string;
    actType?: string;
    status?: ProcessStatus;
    requestDate?: string;
    serialCode: number;
    processedDate?: string;
    requester?: User;
    processedResult?: string;
}
