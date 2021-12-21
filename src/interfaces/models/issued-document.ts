import {ProcessStatus} from '@/enums/process-status';

export interface IssuedDocument {
    type: string;
    actType?: string;
    status?: ProcessStatus;
    requestDate?: string;
    serialCode?: number;
    processedDate?: string;
}
