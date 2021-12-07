import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from './plugins/axios';

const app = createApp(App)
    .provide('$axios', axios)
    .use(store)
    .use(router)
    .mount('#app');

export default app;
