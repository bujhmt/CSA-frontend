import {createStore, createLogger} from 'vuex';
import auth from './auth';

export default createStore({
    plugins: [createLogger()],
    modules: {
        auth,
    },
});
