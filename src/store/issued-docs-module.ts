import {
    Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import {$get} from '@/plugins/axios';
import {Paginated} from '@/interfaces/paginated';
import {IssuedDocument} from '@/interfaces/models/issued-document';

@Module({ namespaced: true })
export default class IssuedDocsModule extends VuexModule {
    private _issuedDocuments: Paginated<IssuedDocument> = {entities: []};

    get issuedDocuments(): IssuedDocument[] {
        return this._issuedDocuments?.entities || [];
    }

    get issuedDocumentsTotal(): number {
        return this._issuedDocuments?.total || 0;
    }

    @Mutation
    public SET_ISSUED_DOCUMENTS(
        {issuedDocuments, total}: {issuedDocuments: IssuedDocument[], total: number},
    ): void {
        this._issuedDocuments = {
            entities: [...(this._issuedDocuments?.entities || []), ...issuedDocuments],
            total,
        };
    }

    @Action({ rawError: true })
    fetchIssuedDocuments(): Promise<number> {
        return $get<IssuedDocument[]>('/issued-docs')
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
}
