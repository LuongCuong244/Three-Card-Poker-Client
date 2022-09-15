import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View, Text, TextInput } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign'
import socketController from '../../socketIO/socket.controller';
import Toast from 'react-native-simple-toast'
import LinearGradient from "react-native-linear-gradient";
import { useSelector, useDispatch } from 'react-redux';
import {
    selectUser,
} from '../../slices/user.slices';
import {
    setRoomName, setPosition
} from '../../slices/room.slices';
import FormatCoin from "../../modules/FormatCoin";
import RoomApi from "../../api/room.api";

export default function CreateRoom(props) {

    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [minBet, setMinBet] = useState('');

    const onClose = () => {
        setName('');
        setPassword('');
        props.setVisible(false);
    }

    const onPressRoomCreate = async () => {
        if (!user.userName) {
            Toast.show('Lỗi khi tạo bàn!');
            return;
        }

        if(!name){
            return Toast.show('Tên bàn không được để trống!');
        }

        RoomApi.createRoom({
            userName: user.userName,
            roomName: name,
            roomPassword: password,
            minBet: minBet,
        })
            .then( async (res) => {
                if (res.data.error) {
                    Toast.show(res.data.error, Toast.LONG);
                    if (res.data.error === 'Mức tiền cược nhỏ nhất tối thiếu là: 1.000') {
                        setMinBet(1000);
                    }
                    return;
                }
                onClose();

                socketController.joinRoom(res.data.roomName);
                socketController.updateRooms();
                socketController.reloadRoom(res.data.roomName, res.data);
                socketController.reqSetPosition(res.data.position);
                // socketRoom.emit('join_Room', res.data.roomName);
                // socketRoom.emit('update_Rooms');
                // socketRoom.emit('reload_Room', res.data.roomName, res.data);
                // socketRoom.emit('req_Set_Position', res.data.position);

                await dispatch(setRoomName(res.data.roomName));
                await dispatch(setPosition(10));

                props.navigation.navigate('PlayGame', {
                    minBet: minBet,
                })
                Toast.show('Tạo phòng thành công !')
            })
            .catch((error) => {
                Toast.show(error, Toast.LONG);
            })

    }

    return (
        <Modal
            transparent={true}
            animationType='fade'
            visible={props.isShow}
            statusBarTranslucent={true}
        >
            <View style={styles.modalContainer} >
                <LinearGradient
                    style={styles.viewContainer}
                    colors={['#6dbdc0', '#e0fafb']}
                >
                    <View style={styles.viewContainerClose} >
                        <TouchableOpacity
                            onPress={() => {
                                props.setVisible(false)
                            }}
                            activeOpacity={0.7}
                        >
                            <AntDesign name='closecircle' size={45} color='red' style={{ backgroundColor: 'white', borderRadius: 50 }}></AntDesign>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer} >
                        <Text style={styles.fieldName} >Nhập tên bàn:</Text>
                        <View style={styles.textInputContainer} >
                            <TextInput
                                style={styles.textInput}
                                placeholder="Bắt buộc"
                                onChangeText={(name) => {
                                    if (name.length < 20) {
                                        setName(name.replace(/[^A-Z0-9\_]/ig, ''));
                                    }
                                }}
                                value={name}
                            ></TextInput>
                        </View>
                    </View>

                    <View style={styles.inputContainer} >
                        <Text style={styles.fieldName} >Nhập mật khẩu:</Text>
                        <View style={styles.textInputContainer} >
                            <TextInput
                                style={styles.textInput}
                                placeholder="Không bắt buộc"
                                onChangeText={(password) => {
                                    if (password.length < 20) {
                                        setPassword(password.replace(/[^A-Z0-9\_]/ig, ''));
                                    }
                                }}
                                value={password}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer} >
                        <Text style={styles.fieldName} >Mức tiền cược nhỏ nhất:</Text>
                        <View style={styles.textInputContainer} >
                            <TextInput
                                style={[styles.textInput, { color: 'blue', fontWeight: 'bold' }]}
                                placeholder="Tối thiểu 1000"
                                keyboardType="numeric"
                                onChangeText={(minBet) => {
                                    setMinBet(minBet.replace(/[^0-9]/ig, ''));
                                }}
                                value={FormatCoin(minBet)}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.createRoomButton}
                        onPress={onPressRoomCreate}
                    >
                        <LinearGradient
                            style={styles.linearButton}
                            colors={['tomato', 'red']}
                        >
                            <Text style={styles.textButton}>Tạo mới</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    viewContainer: {
        height: 280,
        width: 340,
        backgroundColor: '#e0fafb',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
        alignItems: 'center'
    },
    viewContainerClose: {
        width: '100%',
        alignItems: 'flex-end',
        bottom: '8%',
        left: '6%'
    },
    inputContainer: {
        width: '90%',
        height: 65,
        marginTop: 5,
        alignItems: 'flex-start',
        bottom: 40,
    },
    fieldName: {
        letterSpacing: 1,
        color: 'rgb(50,50,50)',
        fontStyle: 'italic',
        fontSize: 15,
        marginVertical: 5,
        marginLeft: 10,
        textAlign: 'center',
    },
    textInputContainer: {
        width: '100%',
        height: 35,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        fontSize: 18,
        height: 60,
        width: '100%',
        letterSpacing: 1,
        color: 'rgb(50,50,50)',
        textAlign: 'center',
        padding: 0,
    },
    createRoomButton: {
        width: 120,
        height: 35,
        bottom: 25,
    },
    linearButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    textButton: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
        letterSpacing: 0.5
    }
})