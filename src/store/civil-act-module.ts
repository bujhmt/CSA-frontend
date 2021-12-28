import {
    Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import {Paginated} from '@/interfaces/paginated';
import { User } from '@/interfaces/models/user';
import { $get } from '@/plugins/axios';
import { UsersQuery } from '@/interfaces/query/users-query';

@Module({namespaced: true})
export default class ActionLogsModule extends VuexModule {
    private users: Paginated<Partial<User>> = {entities: [], total: 0};
    private usersMap: Record<string, Partial<Partial<User>>> = {};

    get list(): Partial<User>[] {
        return this.users.entities || [];
    }

    get total(): number {
        return this.users.total || 0;
    }

    get getById() {
        return (id: string): Partial<Partial<User>> => this.usersMap[id];
    }

    @Mutation
    SET_USERS({users, total}: { users: User[], total: number }): void {
        this.users = {
            total,
            entities: users,
        };
    }

    @Mutation
    MAP_USER({id, user}: { id: string, user: Partial<User> }): void {
        this.usersMap = {
            ...this.usersMap,
            [id]: user,
        };
    }

    @Mutation
    CLEAR_MAP_BY_ID(id: string): void {
        delete this.usersMap[id];
    }

    @Action({rawError: true})
    fetchList({authToken, ...params}: UsersQuery & { authToken: string }): Promise<void> {
        console.log(params);
        return $get<User[]>(
            '/user/users',
            authToken,
            {params},
        )
            .then((answer) => {
                if (answer?.success && answer.data) {
                    this.context.commit('SET_USERS', {
                        users: answer.data,
                        total: answer.total,
                    });
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    @Action({rawError: true})
    clearRecord(id: string): void {
        this.context.commit('CLEAR_MAP_BY_ID', id);
    }
}
