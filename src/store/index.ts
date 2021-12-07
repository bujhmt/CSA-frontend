import {createStore, createLogger} from 'vuex';
import auth from './auth';
import Auth from './authModule';

export default createStore({
    plugins: [createLogger()],
    modules: {
        auth,
    },
});
