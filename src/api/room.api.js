import { API_URL } from './API_URL';
import axiosApiInstance from '../config/axios.instance.config';

const PATHS = {
    get_all_rooms: API_URL + "/room/get-all-rooms",
    create_room: API_URL + "/room/create-room",
    join_room: API_URL + "/room/join-room",
    get_data: API_URL + "/room/get-data",
    change_bet: API_URL + "/room/change-bet",
    find_room: API_URL + "/room/find-room",
}

class Room_API {

    getAllRooms(){
        return axiosApiInstance.get(PATHS.get_all_rooms);
    }

    createRoom(data){
        return axiosApiInstance.post(PATHS.create_room, data);
    }

    findRoom(roomName){
        return axiosApiInstance.post(PATHS.find_room, {
            roomName
        })
    }

    changeBet(data){
        return axiosApiInstance.post(PATHS.change_bet, data);
    }

    getRoomData(roomName){
        return axiosApiInstance.post(PATHS.get_data, {
            roomName
        });
    }

    joinRoom(data){
        return axiosApiInstance.post(PATHS.join_room, data);
    }
}

export default new Room_API;