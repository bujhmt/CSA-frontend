import {Axios, AxiosResponseHeaders} from 'axios';
import getEnv from '@/helpers/get-env';

export default new Axios({
    baseURL: getEnv<string>('VUE_APP_API_URL'),
    headers: {
        'Content-Type': 'application/json',
    },
    transformRequest: [function transformRequest(data) {
        try {
            return JSON.stringify(data);
        } catch (err) {
            throw Error(`Error stringifying request:\n ${err}`);
        }
    }],
    transformResponse: [function transformResponse(data: string) {
        try {
            return JSON.parse(data);
        } catch (err) {
            throw Error(`Error parsing response:\n ${err}`);
        }
    }],
});
