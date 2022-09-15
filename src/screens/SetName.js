import React, { useState } from "react";
import {
    View,
    Dimensions,
    ImageBackground,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    Alert
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CircleSnail } from "react-native-progress";
import { useDispatch } from 'react-redux';
import socketController from '../socketIO/socket.controller';
import {
    setUser,
} from '../slices/user.slices';
import UserApi from "../api/user.api";
import socket from '../config/socket.config';
import { currentUserStatic } from "../static/user.static";

export default function SetName(props) {

    const dispatch = useDispatch();

    const [userName, setUserName] = useState('YourName');
    const [sending, isSending] = useState(false);

    const checkUserName = () => {
        let reg = /^[a-zA-z][\w\_]{2,14}$/  // Ký tự đầu là chữ cái, sau đó thì tối đa 14, tối thiểu 2 ký tự là chữ cái, số và dấu gạch dưới.
        return reg.test(userName);
    }

    const onPressConfirm = () => {
        if (!checkUserName()) {
            return Alert.alert("Tên không hợp lệ!");
        }

        isSending(true);

        UserApi.createNewUser({ userName, email: props.route.params?.email })
            .then(async (res) => {

                if (res.data.error) {
                    Alert.alert(JSON.stringify(res.data.error.title), JSON.stringify(res.data.error.message));
                    return;
                }

                if (res.data.accessToken && res.data.user && res.data.refreshToken) {
                    AsyncStorage.setItem('user', JSON.stringify(res.data.user));
                    AsyncStorage.setItem('accessToken', res.data.accessToken);
                    AsyncStorage.setItem('refreshToken', res.data.refreshToken);
                    await dispatch(setUser(res.data.user));

                    socket.connect();
                    if (socket.connected) {
                        currentUserStatic.userName = res.data.user.userName;
                        socketController.playerHasConnected(res.data.user.userName); // send userId to server
                        props.navigation.navigate("Home");
                    } else {
                        console.log('Kết nối IO chưa sẵn sàng!');
                    }

                } else {
                    Alert.alert("Something went wrong... Try later!")
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                isSending(false);
            })
    }
    return (
        <View style={styles.container} >
            <ImageBackground
                style={styles.imageBackground}
                source={require('../assets/img/YourName.jpg')}
            >
                <TextInput
                    style={styles.edtText}
                    onChangeText={userName => setUserName(userName)}
                    editable={!sending}
                >
                    YourName
                </TextInput>
                <TouchableOpacity activeOpacity={0.7} onPress={onPressConfirm}>
                    <View style={styles.buttonConfirm} >
                        {
                            sending ? (
                                <CircleSnail size={20} color={['white']} />
                            ) : (
                                <Text style={styles.textConfirm} >XÁC NHẬN</Text>
                            )
                        }
                    </View>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    )
}

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageBackground: {
        height: height,
        width: (2067 / 1241) * height,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    edtText: {
        width: 400,
        height: 100,
        fontSize: 55,
        color: 'rgb(255,148,0)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
        textShadowColor: 'white',
        fontWeight: 'bold',
        bottom: '49%',
        left: '28%'
    },
    buttonConfirm: {
        backgroundColor: '#12d457',
        width: 160,
        height: 40,
        marginBottom: 10,
        borderRadius: 20,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 1.8,
        elevation: 6,
        shadowRadius: 15,
        shadowOffset: { width: 1, height: 13 },
        justifyContent: 'center',
        alignItems: 'center'
    },
    textConfirm: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold'
    }
})