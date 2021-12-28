import {PassportData} from '@/interfaces/models/nested/passport-data';
import {UserDocument} from '@/interfaces/models/nested/user-document';
// eslint-disable-next-line import/no-cycle
import {IssuedDocument} from '@/interfaces/models/issued-document';

export interface User {
    isActive: boolean;
    login: string;
    name: string;
    role?: string;
    passportData?: PassportData;
    userDocuments?: UserDocument[];
    issuedDocuments?: Partial<IssuedDocument>[];
}
