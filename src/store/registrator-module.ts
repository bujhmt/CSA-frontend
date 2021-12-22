import {
    Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import {Paginated} from '@/interfaces/paginated';
import {IssuedDocument} from '@/interfaces/models/issued-document';
import {ProcessStatus} from '@/enums/process-status';
import { $get } from '@/plugins/axios';

@Module({namespaced: true})
export default class RegistratorModule extends VuexModule {
    private issuedDocuments: Paginated<IssuedDocument> = {entities: [], total: 0};

    get list(): IssuedDocument[] {
        return this.issuedDocuments?.entities || [];
    }

    get total(): number {
        return this.issuedDocuments?.total || 0;
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

    @Action({rawError: true})
    fetchAll(): Promise<number> {
        return $get<IssuedDocument[]>('/issued-docs/all', this.context.rootState.auth.token)
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
