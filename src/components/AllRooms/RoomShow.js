import React, { useRef, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View, Text, TextInput, Image } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import socketController from '../../socketIO/socket.controller';
import Toast from 'react-native-simple-toast'
import LinearGradient from "react-native-linear-gradient";
import formatCoin from "../../modules/FormatCoin";
import formatCoinByLetter from "../../modules/FormatCoinByLetter";
import { useSelector, useDispatch } from 'react-redux';
import {
    selectUser,
} from '../../slices/user.slices';
import {
    setRoomName, setPosition
} from '../../slices/room.slices';
import RoomApi from "../../api/room.api";

export default function RoomShow(props) {

    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const [heightViewInformation, setHeightViewInformation] = useState(100);
    const [password, setPassword] = useState();

    const isLoadingComePlay = useRef(false);

    const _onClose = () => {
        setPassword(null);
        props.setVisible(false);
    }

    const _onChanText_Password = (password) => {
        setPassword(password);
    }

    const _onVisit = () => {

    }

    const _onLayout = (event) => {
        setHeightViewInformation(event.nativeEvent.layout.height);
    }

    const _onComePlay = async () => {
        let roomName = props.roomItem.roomName;
        if (isLoadingComePlay.current) {
            return;
        }
        isLoadingComePlay.current = true;
        RoomApi.joinRoom({
            userName: user.userName,
            roomName: roomName,
            roomPassword: password,
        })
            .then( async (res) => {
                isLoadingComePlay.current = false;
                if (res.data.error) {
                    Toast.show(res.data.error);
                    return;
                }

                socketController.joinRoom(roomName);
                socketController.updateRooms();

                socketController.resetReadyCounter(roomName, res.data);

                if (res.data.isRunning === false) {  // yêu cầu reset lại bộ đếm
                    socketController.countDownNewGame(roomName);
                }

                props.setVisible(false); // ẩn bảng

                await dispatch(setRoomName(res.data.roomName));
                await dispatch(setPosition(res.data.position)); 

                props.navigation.navigate('PlayGame', {
                    minBet: res.data.minBet,
                })
            })
            .catch(error => {
                isLoadingComePlay.current = false;
                console.log(error, '-RoomShow');
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
                    colors={['#1f61f1', '#971cb6']}
                >
                    <View style={styles.viewContainerClose} >
                        <TouchableOpacity
                            onPress={_onClose}
                            activeOpacity={0.7}
                        >
                            <AntDesign name='closecircle' size={45} color='red' style={{ backgroundColor: 'white', borderRadius: 50 }}></AntDesign>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={styles.informationContainer}
                        onLayout={_onLayout}
                    >
                        {
                            props.roomItem.ownerOfRoom ? (
                                <Image
                                    style={{
                                        width: props.roomItem.havePassword != 'No' ? 0.8 * heightViewInformation : 0.6 * heightViewInformation,
                                        height: props.roomItem.havePassword != 'No' ? 0.8 * heightViewInformation : 0.6 * heightViewInformation,
                                        marginHorizontal: 0.1 * heightViewInformation,
                                        borderRadius: props.roomItem.havePassword != 'No' ? 0.8 * 0.25 * heightViewInformation : 0.6 * 0.25 * heightViewInformation,
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        borderColor: 'white',
                                        borderWidth: 1,
                                    }}
                                    source={{ uri: props.roomItem.ownerOfRoom.avatar }}
                                ></Image>
                            ) : (
                                <View
                                    style={{
                                        width: props.roomItem.havePassword != 'No' ? 0.8 * heightViewInformation : 0.6 * heightViewInformation,
                                        height: props.roomItem.havePassword != 'No' ? 0.8 * heightViewInformation : 0.6 * heightViewInformation,
                                        marginHorizontal: 0.1 * heightViewInformation,
                                        borderRadius: props.roomItem.havePassword != 'No' ? 0.8 * 0.25 * heightViewInformation : 0.6 * 0.25 * heightViewInformation,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderColor: 'white',
                                        borderWidth: 1,
                                    }}
                                >
                                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }} >?</Text>
                                </View>
                            )
                        }

                        <View style={styles.informationRoom} >
                            <View style={styles.rowInformation}>
                                <Text style={[styles.textProperties, { color: '#ffd700', }]}>Tên bàn:</Text>
                                <Text style={[styles.textProperties, { color: 'white', }]}>{props.roomItem.roomName}</Text>
                            </View>
                            <View style={styles.rowInformation}>
                                <Text style={[styles.textProperties, { color: '#ffd700', }]}>Chủ phòng:</Text>
                                <Text style={[styles.textProperties, { color: 'white', }]}>{props.roomItem.ownerOfRoom ? props.roomItem.ownerOfRoom.userName : 'Đang chờ xác nhận'}</Text>
                            </View>
                            <View style={styles.rowInformation}>
                                <Text style={[styles.textProperties, { color: '#ffd700', }]}>Số người chơi:</Text>
                                <Text style={[styles.textProperties, { color: 'white', }]}>{props.roomItem.playersInRoom.length}/10</Text>
                            </View>
                            <View style={styles.rowInformation}>
                                <Text style={[styles.textProperties, { color: '#ffd700', }]}>Tiền cược tối thiểu:</Text>
                                <Text style={[styles.textProperties, { color: 'white', }]}>{props.roomItem.minBet < 1000000 ? formatCoin(props.roomItem.minBet) : formatCoinByLetter(props.roomItem.minBet)}</Text>
                            </View>
                        </View>
                    </View>

                    {
                        props.roomItem.havePassword != 'No' ?
                            (
                                <View style={styles.passwordContainer}>
                                    <Text style={styles.textPassword} >Mật khẩu:</Text>
                                    <View style={styles.viewTextInput} >
                                        <FontAwesome5 name='key' size={23} color='#e0bd01'></FontAwesome5>
                                        <View style={{ width: 1, height: '100%', backgroundColor: 'rgb(180,180,150)', marginHorizontal: 5 }} ></View>
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder='Phòng này có mật khẩu'
                                            placeholderTextColor='rgba(255,255,255,0.7)'
                                            onChangeText={_onChanText_Password}
                                        ></TextInput>
                                    </View>
                                </View>

                            ) : null

                    }

                    <View style={styles.buttonContainer} >
                        <TouchableOpacity
                            style={[styles.buttonStyle, { backgroundColor: 'rgb(0,255,0)' }]}
                            activeOpacity={0.7}
                            onPress={_onComePlay}
                        >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.textButton} >Vào chơi</Text>
                            </View>
                        </TouchableOpacity>

                        {/* <TouchableOpacity
                                style={[styles.buttonStyle, { backgroundColor: 'cyan' }]}
                                activeOpacity={0.7}
                                onPress={_onVisit}
                            >
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.textButton} >Vào xem</Text>
                                </View>
                            </TouchableOpacity> */}
                    </View>
                </LinearGradient>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewContainer: {
        height: 280,
        width: 420,
        backgroundColor: '#535d69',
        borderRadius: 20,
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
    },
    viewContainerClose: {
        width: '100%',
        alignItems: 'flex-end',
        bottom: '8%',
        left: '6%',
    },
    informationContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        bottom: 20,
    },
    coinOwnerContainer: {
        height: '25%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(49,51,108,0.5)',
        marginBottom: '25%'
    },
    informationRoom: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 10,
        marginRight: 10,
        borderRadius: 20,
        borderColor: 'rgba(255,255,255,0.7)',
        borderWidth: 1,
    },
    rowInformation: {
        width: '100%',
        height: '22%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingLeft: 5,
        borderBottomColor: 'rgba(255,255,255,0.7)',
        borderBottomWidth: 1
    },
    textProperties: {
        fontWeight: 'bold',
        marginRight: 5,
        fontSize: 17,
    },
    passwordContainer: {
        width: '100%',
        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    textPassword: {
        marginHorizontal: 10,
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    viewTextInput: {
        flex: 1,
        marginRight: 10,
        height: 45,
        borderRadius: 10,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textInput: {
        height: 45,
        fontSize: 20,
        fontStyle: 'italic',
        color: 'white'
    },
    buttonContainer: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonStyle: {
        height: 30,
        width: '30%',
        marginHorizontal: '5%',
        borderRadius: 100,
    },
    textButton: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
    }
})