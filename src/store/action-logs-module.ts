import {
    Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import {Paginated} from '@/interfaces/paginated';
import {ActionLog} from '@/interfaces/models/action-log';
import {ActionLogsQuery} from '@/interfaces/query/action-logs-query';
import {$get} from '@/plugins/axios';

@Module({namespaced: true})
export default class ActionLogsModule extends VuexModule {
    private actionLogs: Paginated<ActionLog> = {entities: [], total: 0};

    get list(): ActionLog[] {
        return this.actionLogs.entities || [];
    }

    get total(): number {
        return this.actionLogs.total || 0;
    }

    @Mutation
    SET_ACTIONS_LOGS({actionLogs, total}: {actionLogs: ActionLog[], total: number}): void {
        this.actionLogs = {
            total,
            entities: actionLogs,
        };
    }

    @Action({rawError: true})
    fetchList({authToken, ...params}: ActionLogsQuery & {authToken: string}): Promise<void> {
        return $get<ActionLog[]>(
            '/logs',
            authToken,
            {params},
        )
            .then((answer) => {
                if (answer?.success && answer.data) {
                    this.context.commit('SET_ACTIONS_LOGS', {
                        actionLogs: answer.data,
                        total: answer.total,
                    });
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }
}
