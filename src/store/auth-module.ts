import {
    Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import getEnv from '@/helpers/get-env';
import axios from '@/plugins/axios';
import {AuthResponse} from '@/interfaces/authResponse';
import {Auth} from '@/interfaces/auth';

const userTokenName = getEnv<string>('VUE_APP_USER_TOKEN_NAME') || 'userToken';

@Module({ namespaced: true })
export default class AuthModule extends VuexModule {
    private token: string | null = localStorage.getItem(userTokenName);
    private loggedIn = !!this.token;
    private role = localStorage.getItem('role') || 'USER';

    get isAuthed(): boolean {
        return this.loggedIn;
    }

    get userRole(): string {
        return this.role;
    }

    get userToken(): string | null{
        return this.token;
    }

    @Mutation
    public loginSuccess({token, role}: {token: string, role: string}): void {
        localStorage.setItem(userTokenName, token);
        localStorage.setItem('role', role);
        this.loggedIn = true;
        this.token = token;
        this.role = role;
    }

    @Mutation
    public loginFailure(): void {
        this.loggedIn = false;
        this.token = '';
    }

    @Mutation
    public logout(): void {
        this.loggedIn = false;
        this.token = '';
    }

    @Mutation
    public registerSuccess(token: string): void {
        localStorage.setItem(userTokenName, token);
        this.loggedIn = false;
    }

    @Mutation
    public registerFailure(): void {
        this.loggedIn = false;
    }

    @Action({ rawError: true })
    async login(credentials: Auth): Promise<boolean> {
        try {
            const {data} = await axios.post<AuthResponse>('/auth/login', credentials);
            if (!data) {
                return false;
            }

            const {token} = data;

            if (token) {
                try {
                    const roleData = await axios.get<string>('/verification/role', {headers: {Authorization: `Bearer ${token}`}});
                    const {data: role} = roleData;
                    this.context.commit('loginSuccess', {token, role});
                    return true;
                } catch {
                    this.context.commit('loginFailure');
                    return false;
                }
            }
            return false;
        } catch (err) {
            console.error(err);
            this.context.commit('loginFailure');
            return false;
        }
    }

    @Action
    signOut(): void {
        localStorage.removeItem(userTokenName);
        this.context.commit('logout');
    }

    @Action({ rawError: true })
    register(credentials: Auth): Promise<boolean> {
        return axios.post<AuthResponse>('/auth/signup', credentials)
            .then((res) => {
                if (!res.data) {
                    return false;
                }

                const {token} = res.data;

                if (token) {
                    this.context.commit('registerSuccess', token);
                    return true;
                }

                this.context.commit('registerFailure');
                return false;
            }).catch((err) => {
                console.error(err);
                this.context.commit('registerFailure');
                return false;
            });
    }
}
