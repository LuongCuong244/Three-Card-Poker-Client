import { API_URL } from './API_URL';
import axiosApiInstance from '../config/axios.instance.config';

const PATHS = {
    sign_in_google: API_URL + "/auth/google",
}

class Auth_API {

    signInWithGoogle(idToken) {
        return axiosApiInstance.post(PATHS.sign_in_google, {
            idToken
        })
    }
}

export default new Auth_API;