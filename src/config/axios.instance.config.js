import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { API_URL } from '../api/API_URL';

const axiosApiInstance = axios.create({
    baseURL: 'http://192.168.0.104:3000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})

axiosApiInstance.interceptors.request.use(
    async config => {
        if (config.url.indexOf('/auth') >= 0 || config.url.indexOf('/create-new-user') >= 0) {
            return config;
        }

        const accessToken = await AsyncStorage.getItem('accessToken');
        config.headers['x-access-token'] = accessToken;
        return config;
    },
    error => {
        Promise.reject(error)
    }
);

axiosApiInstance.interceptors.response.use(
    res => res,
    async error => {
        //console.log(error);

        const config = error?.config;
        if (config?.url.indexOf('/auth') >= 0 || config?.url.indexOf('/create-new-user') >= 0) {
            return Promise.reject(error);;
        }
        if (error?.response?.status === 401) {
            console.log("Token expired!");
            if (error?.response?.data?.message === 'jwt expired') {

                const refreshToken = await AsyncStorage.getItem('refreshToken');

                const data = await (await axiosApiInstance.post(API_URL + "/auth/refresh-token", {
                    refreshToken,
                })).data

                await AsyncStorage.setItem('accessToken', data.newAccessToken);

                config.headers['x-access-token'] = data.newAccessToken;
                console.log("new accessToken: ", data.newAccessToken);
                return axiosApiInstance(config);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosApiInstance;