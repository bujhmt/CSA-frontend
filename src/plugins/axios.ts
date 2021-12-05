import {Axios} from 'axios';
import getEnv from '@/helpers/get-env';

export default new Axios({
    baseURL: getEnv<string>('VUE_APP_API_URL'),
});
