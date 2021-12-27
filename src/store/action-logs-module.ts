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
    private actionLogsMap: Record<string, Partial<ActionLog>> = {};

    get list(): ActionLog[] {
        return this.actionLogs.entities || [];
    }

    get total(): number {
        return this.actionLogs.total || 0;
    }

    get getById() {
        return (id: string): Partial<ActionLog> => this.actionLogsMap[id];
    }

    @Mutation
    SET_ACTIONS_LOGS({actionLogs, total}: { actionLogs: ActionLog[], total: number }): void {
        this.actionLogs = {
            total,
            entities: actionLogs,
        };
    }

    @Mutation
    MAP_ACTION_LOG({id, actionLog}: { id: string, actionLog: Partial<ActionLog> }): void {
        this.actionLogsMap = {
            ...this.actionLogsMap,
            [id]: actionLog,
        };
    }

    @Mutation
    CLEAR_MAP_BY_ID(id: string): void {
        delete this.actionLogsMap[id];
    }

    @Action({rawError: true})
    fetchList({authToken, ...params}: ActionLogsQuery & { authToken: string }): Promise<void> {
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

    @Action({rawError: true})
    fetchById({authToken, id}: { authToken: string, id: string }): Promise<void> {
        return $get<Partial<ActionLog>>(`/logs/${id}`, authToken)
            .then((response) => {
                if (response?.success && response.data) {
                    this.context.commit('MAP_ACTION_LOG', {
                        id,
                        actionLog: response.data,
                    });
                }
            });
    }

    @Action({rawError: true})
    clearRecord(id: string): void {
        this.context.commit('CLEAR_MAP_BY_ID', id);
    }
}
