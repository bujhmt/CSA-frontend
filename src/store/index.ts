import {createStore, createLogger} from 'vuex';
import issuedDocs from './issued-docs-module';
import auth from './auth-module';
import verification from './verification-module';

export default createStore({
    plugins: [createLogger()],
    modules: {
        auth,
        verification,
        issuedDocs,
    },
});
