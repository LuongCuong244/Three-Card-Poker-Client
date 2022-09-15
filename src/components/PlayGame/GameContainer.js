import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, Dimensions, Animated, TouchableOpacity, Alert } from "react-native";
import TableOwner from "./TableOwner";
import formatCoin from "../../modules/FormatCoin";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import socketController from '../../socketIO/socket.controller';
import socket from '../../config/socket.config';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import ShowPlayerInformation from "./ShowPlayerInformation";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
    selectUser,
} from '../../slices/user.slices';
import {
    playerInRoomUpdated,
    selectRoom, setRoom, setUserNull
} from '../../slices/room.slices';
import Seat from "./Seat";
import RoomApi from "../../api/room.api";

const seats = [
    [
        {
            keyword: 'firstPlayer',
            position: 1,
        },
        {
            keyword: 'secondPlayer',
            position: 2,
        },
        {
            keyword: 'thirdPlayer',
            position: 3,
        }
    ],
    [
        {
            keyword: 'fourthPlayer',
            position: 4,
        },
        {
            keyword: 'fifthPlayer',
            position: 5,
        },
        {
            keyword: 'sixthPlayer',
            position: 6,
        }
    ],
    [
        {
            keyword: 'seventhPlayer',
            position: 7,
        },
        {
            keyword: 'eighthPlayer',
            position: 8,
        },
        {
            keyword: 'ninthPlayer',
            position: 9,
        }
    ],
]

let time;
let timeRoomOwner;
let numberOfAnim = 0;

const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height

export default function GameContainer(props) {

    const user = useSelector(selectUser);
    const room = useSelector(selectRoom, shallowEqual);
    const dispatch = useDispatch();

    const refPlayerInformation = useRef();

    const [showReadyButton, setShowReadyButton] = useState(0); // z-index
    const [showBetTotal, setShowBetTotal] = useState(0); // z-index
    const [showConfirmRoomOwner, setShowConfirmRoomOwner] = useState(0); // z-index
    const [qualifiedToRoomOwner, setQualifiedToRoomOwner] = useState(true); // xét xem người dùng đủ điều kiện để làm chủ bàn không.
    const [pressedRoomOwnerButton, setPressedRoomOwnerButton] = useState(false); // đã nhấn nút làm trưởng phòng chưa
    const [showPlayerInformation, setShowPlayerInformation] = useState(0); // z-index
    const [countDown, setCountDown] = useState(5);
    const stateRefCountdown = useRef();
    const [countDownConfirmRoomOwner, setCountDownConfirmRoomOwner] = useState(5);
    const stateRefCountDownConfirmRoomOwner = useRef(5);
    const [totalBet, setTotalBet] = useState(1000);
    const [animReady, setAnimReady] = useState(new Animated.Value(0.9));
    const [animBetConfirm, setAnimBetConfirm] = useState(new Animated.Value(-Dimensions.get('window').width * 0.8));

    useEffect(() => {

        RoomApi.getRoomData(room.roomName)
            .then(async (res) => {
                if (res.data.error) {
                    Alert.alert("Error", res.data.error);
                    return;
                }
                dispatch(setRoom(res.data));
            })
            .catch(err => console.log(err));

        socket.on('start_countdown_ofNewGame', () => {
            startCountDown();
        })

        socket.on('hide_ready_button', () => {
            setShowReadyButton(0);
            setCountDown(5);
            stateRefCountdown.current = 5;
            if (time) {
                clearInterval(time);
            }
        })

        socket.on('appear_total_bet', async (totalBet) => {
            await setTotalBet(totalBet);
            await setShowBetTotal(2);
            animBetConfirmIn();
        })

        socket.on('kick_off_room', async (response, reason) => {
            if (response === 'All') {
                if (timeRoomOwner) {
                    setBothStateAndRefCountdownConfirmRoomOwner(5);
                    await clearInterval(timeRoomOwner);
                }
                props.leaveTable();
                Toast.show(reason, Toast.SHORT, Toast.CENTER);
                return;
            }
            if (user.userName === response) {
                props.leaveTable();
                Toast.show(reason, Toast.SHORT, Toast.CENTER);
            }
        })

        socket.on('show_find_owner_room', async (qualifiedToOwnerRoom) => {
            if (timeRoomOwner) {
                setBothStateAndRefCountdownConfirmRoomOwner(5);
                await clearInterval(timeRoomOwner);
            }
            timeRoomOwner = setInterval(() => {
                if (stateRefCountDownConfirmRoomOwner.current <= 0) {
                    setPressedRoomOwnerButton(true);
                    clearInterval(timeRoomOwner);
                } else {
                    setBothStateAndRefCountdownConfirmRoomOwner(stateRefCountDownConfirmRoomOwner.current - 1);
                }
            }, 1000);

            if (qualifiedToOwnerRoom.indexOf(user.userName) !== -1) {
                setQualifiedToRoomOwner(true);
            } else {
                setQualifiedToRoomOwner(false);
            }

            setShowConfirmRoomOwner(2);
            setPressedRoomOwnerButton(false);
        })

        socket.on('hide_confirm_owner_room', async (ownerRoomName) => {
            if (timeRoomOwner) {
                await clearInterval(timeRoomOwner);
            }
            setShowConfirmRoomOwner(0);
            setPressedRoomOwnerButton(false);
            setBothStateAndRefCountdownConfirmRoomOwner(5);
            let log = ownerRoomName + ' sẽ là chủ phòng mới !';
            Toast.show(log, Toast.LONG, Toast.CENTER);
        })

        socket.on('game_room_update', (playerData) => {
            dispatch(playerInRoomUpdated(playerData));
        })

        socket.on('update_entire_room', (data) => {
            dispatch(setRoom(data));
        })

        socket.on('set_user_null', (keyOfUser) => {
            dispatch(setUserNull(keyOfUser));
        })

        return () => {
            socket.off('start_countdown_ofNewGame');
            socket.off('hide_ready_button');
            socket.off('kick_off_room');
            socket.off('appear_total_bet');
            socket.off('show_find_owner_room');
            socket.off('hide_confirm_owner_room');
            socket.off('game_room_update');
            socket.off('update_entire_room');
            socket.off('set_user_null');

            if (time) {
                clearInterval(time);
            }
        }
    }, []);

    const setBothStateAndRefCountdownConfirmRoomOwner = (value) => {
        stateRefCountDownConfirmRoomOwner.current = value;
        setCountDownConfirmRoomOwner(stateRefCountDownConfirmRoomOwner.current);
    }

    const startCountDown = async () => {
        if (time != null) {
            await clearInterval(time);
        }
        await setShowReadyButton(2);
        await setCountDown(5);
        stateRefCountdown.current = 5;

        time = setInterval(() => {
            if (stateRefCountdown.current <= 0) {
                setShowReadyButton(0);

                setCountDown(5);
                stateRefCountdown.current = 5;

                clearInterval(time);
            } else {
                stateRefCountdown.current -= 1;
                setCountDown(stateRefCountdown.current);
            }
        }, 1000);
    }

    const onSetShowPlayerInformation = (userName) => {
        setShowPlayerInformation(2);
        return;
        axios.post(API_URL + '/user/get-Statistical-And-Information', {
            userName: userName
        })
            .then((res) => {
                if (res.data.error) {
                    Toast.show(res.data.error);
                    props.hidePlayerInformation();
                    return;
                }
                let user = {
                    ...res.data.statistical,
                    ...res.data.information
                };
                this.setState({
                    user: user,
                })
            })
    }

    const hidePlayerInformation = () => {
        setShowPlayerInformation(0);
    }

    const animReadyIn = () => {
        Animated.timing(animReady, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            animReadyOut();
        })
    }

    const animReadyOut = () => {
        Animated.timing(animReady, {
            toValue: 0.9,
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            if (numberOfAnim > 7) {
                numberOfAnim = 0;
            } else {
                numberOfAnim++;
                animReadyIn();
            }
        })
    }

    const animBetConfirmIn = () => {
        Animated.timing(animBetConfirm, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            setTimeout(() => {
                animBetConfirmOut();
            }, 1000);
        });
    }

    const animBetConfirmOut = () => {
        Animated.timing(animBetConfirm, {
            toValue: Dimensions.get('window').width * 0.8,
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            socketController.startGame(room.roomName);
            setShowBetTotal(0);
            // this.setState({
            //     showBetTotal: 0, 
            //     coinBetTotal: 0,    ????????
            // })
        });
    }

    return (
        <View style={{ flex: 1 }} >
            {
                room.position && (
                    <View style={{ flex: 1 }} >
                        <ImageBackground style={styles.container}>
                            <View style={styles.imageGuestContainer}>
                                <View style={styles.viewChildTable} >
                                    {
                                        seats.map((row, index) => {
                                            return (
                                                <View key={index} style={styles.rowContainer} >
                                                    {
                                                        row.map((seat, seatIndex) => {
                                                            return (
                                                                <Seat
                                                                    key={seatIndex}
                                                                    keyword={seat.keyword}
                                                                    isMySeat={room.position === seat.position}
                                                                    showPlayerInfor={onSetShowPlayerInformation}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </View>
                            <TableOwner
                                keyword={'ownerOfRoom'}
                                isMySeat={room.position === 10}
                                showPlayerInfor={onSetShowPlayerInformation}
                            ></TableOwner>
                        </ImageBackground>

                        {
                            showReadyButton === 2 ? (
                                <View
                                    style={{
                                        flex: 1,
                                        zIndex: showReadyButton,
                                        position: 'absolute',
                                    }}
                                >
                                    <View style={[styles.containerModal, { backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', padding: 10, alignItems: 'center' }]} >
                                        <View style={[styles.viewTime, { bottom: 50, width: 70, height: 70 }]}>
                                            <Text style={styles.textTime} >{countDown}</Text>
                                        </View>

                                        <TouchableOpacity
                                            style={{ width: 150, height: 50, bottom: 30 }}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                                socketController.ready(room.roomName, room.playerKey);
                                                setShowReadyButton(0);
                                            }}
                                        >
                                            <Animated.View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', elevation: 10, borderRadius: 100, transform: [{ scale: animReady }] }}>
                                                <Text style={{ textAlign: 'center', fontSize: 21, fontWeight: 'bold', color: 'white' }} >Sẵn sàng</Text>
                                            </Animated.View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : null
                        }

                        {
                            showBetTotal === 2 ? (
                                <View
                                    style={{
                                        flex: 1,
                                        zIndex: showBetTotal,
                                        position: 'absolute',
                                    }}
                                >
                                    <View style={{ width: widthScreen, height: heightScreen, backgroundColor: 'rgba(0,0,0,0)' }}>
                                        <Animated.View style={{
                                            flex: 1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transform: [{
                                                translateY: animBetConfirm
                                            }]
                                        }}>
                                            <View
                                                style={{ width: '100%', height: 55, bottom: '5%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.7)' }}
                                            >
                                                <Text style={{ textAlign: 'center', fontStyle: 'italic', color: 'white', fontSize: 22, right: '50%' }} >Tổng cược: </Text>
                                                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#ffd700', fontSize: 37 }} >{formatCoin(totalBet)}</Text>
                                                <MaterialIcons name='attach-money' color='#ffd700' size={40} ></MaterialIcons>
                                            </View>
                                        </Animated.View>
                                    </View>
                                </View>
                            ) : null
                        }

                        {
                            showConfirmRoomOwner === 2 ? (
                                <View
                                    style={{
                                        width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center',
                                        zIndex: showConfirmRoomOwner,
                                        position: 'absolute',
                                    }}
                                >
                                    <LinearGradient
                                        style={styles.confirmOwnerContainer}
                                        colors={['#d8ffff', '#cdcad1']}
                                    >
                                        <LinearGradient
                                            style={styles.confirmOwnerTitleContainer}
                                            colors={['#3499FF', '#3A3985']}
                                        >
                                            <Text style={styles.confirmOwnerTitle}>CHỦ PHÒNG ĐÃ RỜI BÀN</Text>
                                            <Text style={styles.confirmOwnerTime} >{countDownConfirmRoomOwner}</Text>
                                        </LinearGradient>
                                        <Text style={styles.confirmOwnerMessage} >{qualifiedToRoomOwner ? 'Bạn có muốn làm chủ phòng mới không ?' : 'Đang hỏi những người đủ điều kiện làm chủ phòng !'}</Text>
                                        {
                                            qualifiedToRoomOwner && pressedRoomOwnerButton === false ? (
                                                <View style={styles.confirmOwnerButtonContainer}>
                                                    <TouchableOpacity
                                                        activeOpacity={0.7}
                                                        style={styles.confirmOwnerButton}
                                                        onPress={() => {
                                                            setPressedRoomOwnerButton(true);
                                                        }}
                                                    >
                                                        <LinearGradient style={styles.confirmOwnerLinearButton} colors={['#e10f68', '#ab3667']}>
                                                            <Text style={styles.confirmOwnerLinearText}>Không</Text>
                                                        </LinearGradient>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        activeOpacity={0.7}
                                                        style={styles.confirmOwnerButton}
                                                        onPress={() => {
                                                            if (socket.connected) {
                                                                setPressedRoomOwnerButton(true);
                                                                socketController.setRoomOwner(room.roomName, room.position);
                                                            }
                                                        }}
                                                    >
                                                        <LinearGradient style={styles.confirmOwnerLinearButton} colors={['#1fd906', '#15a003']}>
                                                            <Text style={styles.confirmOwnerLinearText}>Có</Text>
                                                        </LinearGradient>
                                                    </TouchableOpacity>
                                                </View>
                                            ) : (
                                                <View style={styles.confirmOwnerButtonContainer}>
                                                    <Text>Hãy chờ một lát ...</Text>
                                                </View>
                                            )
                                        }
                                    </LinearGradient>
                                </View>
                            ) : null
                        }

                        {
                            showPlayerInformation === 2 ? (
                                <View
                                    style={{
                                        width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center',
                                        zIndex: showPlayerInformation,
                                        position: 'absolute',
                                    }}
                                >
                                    <ShowPlayerInformation
                                        hidePlayerInformation={hidePlayerInformation}
                                    ></ShowPlayerInformation>
                                </View>
                            ) : null
                        }
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
    },
    imageGuestContainer: {
        height: '100%',
        flex: 1
    },
    viewChildTable: {
        width: '100%',
        height: '100%'
    },
    rowContainer: {
        width: '100%',
        height: '33.333333%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    imageTableOwner: {
        height: 240,
        width: 120,
    },
    containerModal: {
        width: widthScreen,
        height: heightScreen,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    viewTime: {
        borderRadius: 100,
        width: 50,
        height: 50,
        borderColor: 'white',
        borderWidth: 4,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textTime: {
        textAlign: 'center',
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold'
    },
    stackView: {
        width: '60%',
        height: '60%',
        borderRadius: 20,
        backgroundColor: 'white',
        marginTop: 10,
    },
    styleContainerView: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        backgroundColor: 'white',
        position: 'absolute'
    },
    confirmOwnerContainer: {
        width: 290,
        height: 160,
        borderRadius: 25
    },
    confirmOwnerTitleContainer: {
        width: '100%',
        height: 40,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    confirmOwnerTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        letterSpacing: 1,
        flex: 1,
    },
    confirmOwnerTime: {
        width: 40,
        height: 40,
        textAlign: 'center',
        fontSize: 28,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        borderWidth: 1,
        color: 'rgb(30,30,30)',
        backgroundColor: '#ffc4a4',
    },
    confirmOwnerMessage: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: 'rgb(20,20,20)',
        padding: 10,
    },
    confirmOwnerButtonContainer: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    confirmOwnerButton: {
        width: 80,
        height: 35,
        marginHorizontal: 30,
    },
    confirmOwnerLinearButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    confirmOwnerLinearText: {
        fontWeight: 'bold',
        color: 'white'
    }
})