import {
    Action,
    Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import {$get} from '@/plugins/axios';

@Module({ namespaced: true })
export default class VerificationModule extends VuexModule {
    private _verificationStatus = false;

    get verificationStatus(): boolean {
        return this._verificationStatus;
    }

    @Mutation
    SET_VERIFICATION_STATUS(status: boolean): void {
        this._verificationStatus = status;
    }

    @Action({ rawError: true })
    fetchVerificationStatus(): Promise<void> {
        return $get<boolean>('/verification').then((answer) => {
            if (answer?.success) {
                this.context.commit('SET_VERIFICATION_STATUS', answer.data);
            }
        });
    }
}
