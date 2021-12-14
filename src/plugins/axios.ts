import {Axios} from 'axios';
import getEnv from '@/helpers/get-env';

const axios = new Axios({
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
});

axios.interceptors.response.use((response) => {
    const {data, headers} = response;
    try {
        if (headers && headers['content-type'].includes('application/json')) {
            const parsed = JSON.parse(data);
            return {data: parsed, headers};
            // Need to return the response in the same form or else axios dies
        }
        return data;
    } catch (err) {
        throw Error(`Error parsing response:\n ${err}`);
    }
}, (err) => Promise.reject(err));

export default axios;
