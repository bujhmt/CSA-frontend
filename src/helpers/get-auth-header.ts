import getEnv from './get-env';

export default function getAuthHeader(): {Authorization?: string;} {
    const userTokenName = getEnv<string>('VUE_APP_USER_TOKEN_NAME') || 'userToken';
    const storedUser = localStorage.getItem(userTokenName);
    const user = JSON.parse(storedUser || '');

    if (user && user.accessToken) {
        return { Authorization: `Bearer ${user.accessToken}` };
    }
    return {};
}
