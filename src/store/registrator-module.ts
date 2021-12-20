import {
    Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import {$get, $post} from '@/plugins/axios';
import {Paginated} from '@/interfaces/paginated';
import {IssuedDocument} from '@/interfaces/models/issued-document';
import { ProcessStatus } from '@/enums/process-status';

@Module({ namespaced: true })
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
        {issuedDocuments, total}: {issuedDocuments: IssuedDocument[], total: number},
    ): void {
        this.issuedDocuments = {
            entities: [...(this.issuedDocuments?.entities || []), ...issuedDocuments],
            total,
        };
    }

    @Action({ rawError: true })
    fetchAll(): boolean {
        const mockData = [{
            type: 'Витяг', status: ProcessStatus.RECEIVED, requestDate: '2021.12.12', serialCode: 152410,
        },
        {
            type: 'Витяг', status: ProcessStatus.RECEIVED, requestDate: '2021.11.12', serialCode: 152409,
        },
        {
            type: 'Свідоцтво', status: ProcessStatus.RECEIVED, requestDate: '2021.10.12', serialCode: 152408,
        },
        {
            type: 'Витяг', status: ProcessStatus.RECEIVED, requestDate: '2021.10.10', serialCode: 152407,
        },
        {
            type: 'Свідоцтво', status: ProcessStatus.RECEIVED, requestDate: '2021.10.09', serialCode: 152406,
        },
        {
            type: 'Свідоцтво', status: ProcessStatus.RECEIVED, requestDate: '2021.10.05', serialCode: 152405,
        },
        {
            type: 'Витяг', status: ProcessStatus.RECEIVED, requestDate: '2021.09.25', serialCode: 152404,
        },
        ];
        this.issuedDocuments.entities = mockData;
        return true;
    }
}
