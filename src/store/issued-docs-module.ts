import {
    Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import {$get, $post} from '@/plugins/axios';
import {Paginated} from '@/interfaces/paginated';
import {IssuedDocument} from '@/interfaces/models/issued-document';

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
    public MAP_ISSUED_DOCUMENT(issuedDocument: IssuedDocument): void {
        this.issuedDocumentsMap = {
            ...this.issuedDocumentsMap,
            [issuedDocument.serialCode as any]: issuedDocument,
        };
    }

    @Action({rawError: true})
    fetchBySerialCode(
        {serialCode, authToken}: { serialCode: number, authToken: string },
    ): Promise<boolean> {
        return $get<IssuedDocument>('/issued-docs/user', authToken, {params: {serialCode}})
            .then((answer) => {
                console.log(answer);
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
            });
    }

    @Action({rawError: true})
    sendReq(issuedDoc: IssuedDocument): void {
        $post<IssuedDocument[]>('/issued-docs/request', {auth: this.context.rootState.auth.token, body: issuedDoc})
            .then((answer) => {
                console.log(answer);
                if (answer?.success && answer.data) {
                    this.context.commit('ADD_ISSUED_DOCUMENT', answer.data);
                }
            });
    }
}
