import {createStore, createLogger} from 'vuex';
import issuedDocs from './issued-docs-module';
import auth from './auth-module';
import verification from './verification-module';
import registrator from './registrator-module';

export default createStore({
    plugins: [createLogger()],
    modules: {
        auth,
        verification,
        issuedDocs,
        registrator,
    },
});
