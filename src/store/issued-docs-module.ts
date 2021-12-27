import {
    Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import axios, {$get, $post} from '@/plugins/axios';
import {Paginated} from '@/interfaces/paginated';
import {IssuedDocument} from '@/interfaces/models/issued-document';
import { Answer } from '@/interfaces/answer';

@Module({namespaced: true})
export default class IssuedDocsModule extends VuexModule {
    private issuedDocuments: Paginated<IssuedDocument> = {entities: [], total: 0};
    private issuedDocumentsMap: Record<string, IssuedDocument> = {};

    get list(): IssuedDocument[] {
        return this.issuedDocuments?.entities || [];
    }

    get total(): number {
        return this.issuedDocuments?.total || 0;
    }

    get bySerialCode(): (serialCode: number) => IssuedDocument {
        return (serialCode: number): IssuedDocument => this.issuedDocumentsMap[serialCode];
    }

    @Mutation
    public SET_ISSUED_DOCUMENTS(
        {issuedDocuments, total}: { issuedDocuments: IssuedDocument[], total: number },
    ): void {
        this.issuedDocuments = {
            entities: [...(this.issuedDocuments?.entities || []), ...issuedDocuments],
            total,
        };
    }

    @Mutation
    public ADD_ISSUED_DOCUMENT(issuedDocument: IssuedDocument): void {
        this.issuedDocuments.entities.push(issuedDocument);
        this.issuedDocuments.total += 1;
    }

    @Mutation
    public DENY_ISSUED_DOCUMENT(issuedDocument: IssuedDocument): void {
        const idx = this.issuedDocuments.entities.findIndex(
            (val) => val.serialCode === issuedDocument.serialCode,
        );
        this.issuedDocuments.entities[idx] = issuedDocument;
    }

    @Mutation
    public MAP_ISSUED_DOCUMENT(issuedDocument: IssuedDocument): void {
        this.issuedDocumentsMap = {
            ...this.issuedDocumentsMap,
            [issuedDocument.serialCode as any]: issuedDocument,
        };
    }

    @Mutation
    public CLEAR_ISSUED_DOCCUMENTS(): void {
        this.issuedDocuments = {entities: [], total: 0};
    }

    @Action({rawError: true})
    fetchBySerialCode(
        {serialCode, authToken}: { serialCode: number, authToken: string },
    ): Promise<boolean> {
        return $get<IssuedDocument>('/issued-docs/user', authToken, {params: {serialCode}})
            .then((answer) => {
                if (answer?.success && answer.data) {
                    this.context.commit('MAP_ISSUED_DOCUMENT', answer.data);
                }

                return !!answer?.success;
            })
            .catch((err) => {
                console.error(err);
                return false;
            });
    }

    @Action({rawError: true})
    clearAll(): void {
        this.context.commit('CLEAR_ISSUED_DOCCUMENTS');
    }

    @Action({rawError: true})
    fetchAll({authToken}: {authToken?: string}): Promise<number> {
        return $get<IssuedDocument[]>('/issued-docs', authToken || this.context.rootState.auth.token)
            .then((answer) => {
                if (answer?.success && answer.data) {
                    this.context.commit('SET_ISSUED_DOCUMENTS', {
                        issuedDocuments: answer.data,
                        total: answer.total,
                    });
                }

                return answer?.total || 0;
            })
            .catch((err) => {
                console.log(err);
                return 0;
            });
    }

    @Action({rawError: true})
    sendReq(issuedDoc: IssuedDocument): void {
        $post<IssuedDocument[]>('/issued-docs/request', {auth: this.context.rootState.auth.token, body: issuedDoc})
            .then((answer) => {
                if (answer?.success && answer.data) {
                    this.context.commit('ADD_ISSUED_DOCUMENT', answer.data);
                }
            });
    }

    @Action({rawError: true})
    denyReq(
        {serialCode, status, comment}: { serialCode: number, status: string, comment: string },
    ): void {
        console.log({serialCode, status, comment});
        axios.post<Answer<IssuedDocument>>('/issued-docs/updateStatus', {status, comment: comment || undefined}, {
            headers: {
                Authorization: `Bearer ${this.context.rootState.auth.token}`,
            },
            params: {serialCode},
        }).then((answer) => {
            if (answer?.data.success && answer.data.data) {
                this.context.commit('DENY_ISSUED_DOCUMENT', answer.data.data);
            }
        });
    }
}
