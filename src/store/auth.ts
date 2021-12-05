import {
    ActionTree, GetterTree, Module, MutationTree,
} from 'vuex';
import {Auth} from '@/interfaces/auth';
import axios from '@/plugins/axios';
import {Answer} from '@/interfaces/answer';

const _state = () => ({
    _auth: {} as Auth,
});

type ModuleState = ReturnType<typeof _state>

const getters: GetterTree<ModuleState, ModuleState> = {
    auth: (state) => state._auth,
};

const mutations: MutationTree<ModuleState> = {
    SET_AUTH: (state, auth: Auth) => {
        state._auth = auth;
    },
};

const actions: ActionTree<ModuleState, ModuleState> = {
    login({commit}, {login, password}: Auth): Promise<void> {
        return Promise.resolve();
    },

    register({commit}, credentials: Auth): Promise<void> {
        return axios.post<Answer<string>>('/auth/signup', credentials)
            .then((answer) => {
                console.log(answer.data);
            })
            .catch((err) => {
                console.error(err);
            });
    },
};

export default {
    namespaced: true,
    state: _state,
    actions,
    mutations,
    getters,
} as Module<ModuleState, ModuleState>;
