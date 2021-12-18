import {
    Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import {$get, $post} from '@/plugins/axios';
import {Paginated} from '@/interfaces/paginated';
import {IssuedDocument} from '@/interfaces/models/issued-document';

@Module({ namespaced: true })
export default class IssuedDocsModule extends VuexModule {
    private issuedDocuments: Paginated<IssuedDocument> = {entities: []};

    get list(): IssuedDocument[] {
        return this.issuedDocuments?.entities || [];
    }

    get total(): number {
        return this.issuedDocuments?.total || 0;
    }

    @Mutation
    public SET_ISSUED_DOCUMENTS(
        {issuedDocuments, total}: {issuedDocuments: IssuedDocument[], total: number},
    ): void {
        this.issuedDocuments = {
            entities: [...(this.issuedDocuments?.entities || []), ...issuedDocuments],
            total,
        };
    }

    @Action({ rawError: true })
    fetchAll(): Promise<number> {
        return $get<IssuedDocument[]>('/issued-docs', this.context.rootState.auth.token)
            .then((answer) => {
                console.log(answer);
                if (answer?.success && answer.data) {
                    this.context.commit('SET_ISSUED_DOCUMENTS', {
                        issuedDocuments: answer.data,
                        total: answer.total,
                    });
                }

                return answer?.total || 0;
            });
    }

    @Action({ rawError: true })
    sendReq(body: Record<string, string>): Promise<number> {
        return $post<number>('/issued-docs/request', {auth: this.context.rootState.auth.token, body})
            .then((answer) => {
                console.log(answer);
                if (answer?.success && answer.data) {
                    return 1;
                }
                return 0;
            });
    }
}
