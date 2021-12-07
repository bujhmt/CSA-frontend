import {createStore, createLogger} from 'vuex';
import auth from './auth-module';

export default createStore({
    plugins: [createLogger()],
    modules: {
        auth,
    },
});
