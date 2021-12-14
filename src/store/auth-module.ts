import {
    Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import getEnv from '@/helpers/get-env';
import axios from '@/plugins/axios';
import {AuthResponse} from '@/interfaces/authResponse';

const userTokenName = getEnv<string>('VUE_APP_USER_TOKEN_NAME') || 'userToken';

@Module({ namespaced: true })
class Auth extends VuexModule {
    private token: string | null = localStorage.getItem(userTokenName);
    private loggedIn = !!this.token;

    @Mutation
    public loginSuccess(token: string): void {
        localStorage.setItem(userTokenName, token);
        this.loggedIn = true;
        this.token = token;
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
    login(credentials: Auth): Promise<boolean> {
        return axios.post<AuthResponse>('/auth/login', credentials)
            .then((res) => {
                if (!res.data) {
                    return false;
                }

                const {token} = res.data;

                if (token) {
                    this.context.commit('loginSuccess', token);
                    return true;
                }
                this.context.commit('loginFailure');
                return false;
            }).catch((err) => {
                console.error(err);
                this.context.commit('loginFailure');
                return false;
            });
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

    get isAuthed(): boolean {
        return this.loggedIn;
    }
}

export default Auth;
