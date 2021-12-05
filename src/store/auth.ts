import {
    ActionTree, GetterTree, Module, MutationTree,
} from 'vuex';
import {Auth} from '@/interfaces/auth';
import getEnv from '@/helpers/get-env';

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
        console.log('Base url:', getEnv<string>('VUE_APP_API_URL'));
        return Promise.resolve();
    },
    register({commit}, {login, password}: Auth): Promise<void> {
        console.log('Base url:', getEnv<string>('VUE_APP_API_URL'));
        return Promise.resolve();
    },
};

export default {
    namespaced: true,
    state: _state,
    actions,
    mutations,
    getters,
} as Module<ModuleState, ModuleState>;
