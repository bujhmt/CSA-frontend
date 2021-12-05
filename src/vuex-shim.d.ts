import {Store} from 'vuex';
import State from './store';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $store: Store<State>;
    }
}

declare module 'vuex' {
    // eslint-disable-next-line import/prefer-default-export
    export function useStore(key?: string): Store<State>;
  }
