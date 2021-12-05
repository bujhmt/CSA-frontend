import {Store} from 'vuex';
import {Axios} from 'axios';
import State from './store';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $store: Store<State>;
        $axios: Axios,
    }
}

declare module 'vuex' {
    // eslint-disable-next-line import/prefer-default-export
    export function useStore(key?: string): Store<State>;
}
