import {
    ActionTree, GetterTree, Module, MutationTree,
} from 'vuex';
import {Auth} from '@/interfaces/auth';
import axios from '@/plugins/axios';
import { AuthResponse } from '@/interfaces/authResponse';
import getEnv from '@/helpers/get-env';

const userTokenName = getEnv<string>('VUE_APP_USER_TOKEN_NAME') || 'userToken';
const curToken = localStorage.getItem(userTokenName);

const _state = () => ({
    _auth: {
        token: curToken || '',
        isAuthed: !!curToken,
    } as Auth,
});

type ModuleState = ReturnType<typeof _state>

const getters: GetterTree<ModuleState, ModuleState> = {
    token: (state) => state._auth.token,
    isAuthed: (state) => state._auth.isAuthed,
};

const mutations: MutationTree<ModuleState> = {
    loginSuccess: (state, token: string) => {
        state._auth.token = token;
        state._auth.isAuthed = true;
    },
    loginFailure: (state) => {
        state._auth.token = '';
        state._auth.isAuthed = false;
    },
    logout: (state) => {
        state._auth.token = '';
        state._auth.isAuthed = false;
    },
    registrationSuccess: (state, token) => {
        state._auth.token = token;
        state._auth.isAuthed = true;
    },
    registrationFailure: (state) => {
        state._auth.isAuthed = false;
    },
};

const actions: ActionTree<ModuleState, ModuleState> = {
    login({commit}, credentials: Auth): Promise<boolean> {
        return axios.post<AuthResponse>('/auth/login', credentials)
            .then((res) => {
                const {token} = res.data;
                if (token) {
                    localStorage.setItem(userTokenName, token);
                    commit('loginSuccess', token);

                    return true;
                }

                commit('loginFailure');
                return false;
            }).catch((err) => {
                console.error(err);
                commit('loginFailure');
                return false;
            });
    },

    register({commit}, credentials: Auth): Promise<boolean> {
        return axios.post<AuthResponse>('/auth/signup', credentials)
            .then((res) => {
                const {token} = res.data;
                if (token) {
                    localStorage.setItem(userTokenName, token);
                    commit('registrationSuccess', token);
                    return true;
                }

                commit('registrationFailure');
                return false;
            })
            .catch((err) => {
                console.error(err);
                commit('registrationFailure');
                return false;
            });
    },

    logout() {
        localStorage.removeItem(userTokenName);
    },

};

export default {
    namespaced: true,
    state: _state,
    actions,
    mutations,
    getters,
} as Module<ModuleState, ModuleState>;
