import {
    Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import getEnv from '@/helpers/get-env';
import axios from '@/plugins/axios';
import { AuthResponse } from '@/interfaces/authResponse';

const userTokenName = getEnv<string>('VUE_APP_USER_TOKEN_NAME') || 'userToken';
const storedToken = localStorage.getItem(userTokenName);

@Module({ namespaced: true })
class Auth extends VuexModule {
    public status = storedToken ? { loggedIn: true } : { loggedIn: false };

    public token = storedToken;

    @Mutation
    public loginSuccess(token: string): void {
        this.status.loggedIn = true;
        this.token = token;
    }

    @Mutation
    public loginFailure(): void {
        this.status.loggedIn = false;
        this.token = '';
    }

    @Mutation
    public logout(): void {
        this.status.loggedIn = false;
        this.token = '';
    }

    @Mutation
    public registerSuccess(): void {
        this.status.loggedIn = false;
    }

    @Mutation
    public registerFailure(): void {
        this.status.loggedIn = false;
    }

    @Action({ rawError: true })
    login(credentials: Auth): Promise<string> {
        return axios.post<AuthResponse>('/auth/login', credentials)
            .then((res) => {
                const {token} = res.data;
                if (token) {
                    localStorage.setItem(userTokenName, token);
                    this.context.commit('loginSuccess', token);
                    return token;
                }
                this.context.commit('loginFailure');
                return '';
            }).catch((err) => {
                console.error(err);
                return '';
            });
    }

    @Action
    signOut(): void {
        localStorage.removeItem(userTokenName);
        this.context.commit('logout');
    }

    @Action({ rawError: true })
    register(credentials: Auth): Promise<string> {
        return axios.post<AuthResponse>('/auth/register', credentials)
            .then((res) => {
                const {token} = res.data;
                if (token) {
                    localStorage.setItem(userTokenName, token);
                    this.context.commit('registerSuccess', token);
                    return token;
                }
                this.context.commit('registerFailure');
                return '';
            }).catch((err) => {
                console.error(err);
                return '';
            });
    }

    get isLoggedIn(): boolean {
        return this.status.loggedIn;
    }
}

export default Auth;
