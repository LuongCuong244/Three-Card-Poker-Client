import React, { useEffect } from "react";
import {
    View,
    ImageBackground,
    StyleSheet,
    Text,
    Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CircleSnail } from "react-native-progress";
import UserApi from "../api/user.api";
import { useDispatch } from 'react-redux';
import {
    setUser,
} from '../slices/user.slices';
import GoogleSignin from "../config/google.auth.config";
import socket from '../config/socket.config';
import socketController from '../socketIO/socket.controller';
import { currentUserStatic } from '../static/user.static';

export default function Loading(props) {

    const dispatch = useDispatch();

    // function checkIfUserIsPlaying(userName) {
    //     UserApi.checkIfUserIsPlaying(userName)
    //         .then(async (res) => {
    //             if (res.data.userIsPlaying) {
    //                 let room = res.data.roomData;
    //                 Object.keys(room).forEach( async (key) => {
    //                     if (userName === room[key]?.userName) {
    //                         await dispatch(setPlayerKey(key));
    //                         await dispatch(setRoom(room));
    //                         await dispatch(setRoomName(room.roomName));
    //                         props.navigation.navigate("PlayGame", {
    //                             isReconnect: true,
    //                         });
    //                         return;
    //                     }
    //                 })
    //             }
    //             props.navigation.navigate("Home");
    //         })
    //         .catch(() => {
    //             props.navigation.navigate("Home");
    //         })
    // }

    useEffect(() => {

        socket.on('connect', () => {
            if(currentUserStatic.userName){
                socketController.playerHasConnected(currentUserStatic.userName); // whenever app is connected, send userId to server
            }
        })

        AsyncStorage.getItem('accessToken')
            .then((accessToken) => {
                if (accessToken) {
                    UserApi.getUser()
                        .then(async res => {
                            if (res.data.userName) {
                                await dispatch(setUser(res.data));
                                socket.connect();
                                if (socket.connected) {
                                    currentUserStatic.userName = res.data.userName; // gán vào bộ nhớ cục bộ
                                    socketController.playerHasConnected(res.data.userName); // whenever app is connected, send userId to server
                                    props.navigation.navigate("Home");
                                    //checkIfUserIsPlaying(res.data.userName);
                                } else {
                                    console.log('Kết nối IO chưa sẵn sàng!');
                                }
                            } else {
                                console.log("Something went wrong...");
                                GoogleSignin.signOut(); // To login window will be shown.
                                AsyncStorage.clear();
                                props.navigation.navigate('LogIn');
                            }
                        })
                        .catch(err => console.log(err))
                } else {
                    props.navigation.navigate('LogIn');
                }
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <ImageBackground
            style={styles.background}
            source={{ uri: 'https://muathe24h.vn/pictures/images/cach-chia-bai-3-cay-diem-cao-5.jpg' }}
        >
            <View style={styles.wrap} >
                <Text style={styles.label} >
                    {"Đang lấy dữ liệu..."}
                </Text>
                <CircleSnail size={30} color={['white']} />
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrap: {
        padding: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderColor: 'rgba(200,200,200,0.7)',
        borderWidth: 1,
    },
    label: {
        fontSize: 20,
        fontWeight: '500',
        color: 'white',
        marginBottom: 10,
    }
})