import {
    Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import {Paginated} from '@/interfaces/paginated';
import {UsersQuery} from '@/interfaces/query/users-query';
import {$get} from '@/plugins/axios';
import {User} from '@/interfaces/models/user';

@Module({namespaced: true})
export default class UsersModule extends VuexModule {
    private users: Paginated<Partial<User>> = {total: 0, entities: []};
    private usersMap: Record<string, User> = {};

    get list(): Partial<User>[] {
        return this.users.entities || [];
    }

    get total(): number {
        return this.users.total || 0;
    }

    get byLogin() {
        return (login: string): User => this.usersMap[login];
    }

    @Mutation
    SET_USERS({users, total}: {users: Partial<User>[], total: number}): void {
        this.users = {
            total,
            entities: users,
        };
    }

    @Mutation
    MAP_USER({id, user}: {id: string, user: User}): void {
        this.usersMap = {
            ...this.usersMap,
            [id]: user,
        };
    }

    @Action({rawError: true})
    fetchList({authToken, ...params}: UsersQuery & { authToken: string }): Promise<void> {
        return $get<Partial<User>[]>('/user/', authToken, {params})
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
    fetchById({authToken, login}: { authToken: string, login: string }): Promise<void> {
        return $get<User>(`/user/${login}`, authToken)
            .then((response) => {
                if (response?.success && response.data) {
                    this.context.commit('MAP_USER', {
                        id: login,
                        user: response.data,
                    });
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }
}
