import {createStore, createLogger} from 'vuex';
import IssuedDocsModule from '@/store/issued-docs-module';
import AuthModule from '@/store/auth-module';

export default createStore({
    plugins: [createLogger()],
    modules: {
        AuthModule,
        IssuedDocsModule,
    },
});
