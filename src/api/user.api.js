import axiosApiInstance from '../config/axios.instance.config';
import { API_URL } from './API_URL';

const PATHS = {
    create_new_user: API_URL + "/user/create-new-user",
    change_avatar: API_URL + "/user/change-avatar",
    get_user: API_URL + "/user/get-user",
    check_if_user_playing: API_URL + "/user/check-if-user-playing",
}

class User_API {

    createNewUser(data) {
        return axiosApiInstance.post(PATHS.create_new_user, data);
    }

    changeAvatar(base64String){
        return axiosApiInstance.post(PATHS.change_avatar, {
            base64String: base64String,
        });
    }

    getUser(){
        return axiosApiInstance.get(PATHS.get_user);
    }

    checkIfUserIsPlaying(userName){
        return axiosApiInstance.post(PATHS.check_if_user_playing, {
            userName
        });
    }
}

export default new User_API;