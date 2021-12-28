import {createStore, createLogger} from 'vuex';
import issuedDocs from './issued-docs-module';
import auth from './auth-module';
import verification from './verification-module';
import actionLogsModule from './action-logs-module';
import civilActs from './civil-act-module';
import usersModule from './users-module';

export default createStore({
    plugins: [createLogger()],
    modules: {
        auth,
        verification,
        issuedDocs,
        'action-logs': actionLogsModule,
        'civil-acts': civilActs,
        users: usersModule,
    },
});
