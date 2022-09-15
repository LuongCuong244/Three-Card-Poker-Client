import React, { useEffect, useState } from "react";
import { Alert, Dimensions, View, BackHandler, ImageBackground } from "react-native";
import Toast from "react-native-simple-toast";
import GameContainer from "../components/PlayGame/GameContainer";
import ShowChangeBet from "../components/PlayGame/ShowChangeBet";
import StatusBarGame from "../components/PlayGame/StatusBarGame";
import formatCoin from "../modules/FormatCoin";
import socketController from '../socketIO/socket.controller';
import socket from '../config/socket.config';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
    selectUser,
    setCoin
} from '../slices/user.slices';
import {
    resetRoomState,
    selectRoom,
    setPosition
} from '../slices/room.slices';

export default function PlayGame(props) {

    const user = useSelector(selectUser);
    const room = useSelector(selectRoom, shallowEqual);
    const dispatch = useDispatch();

    const [showChangeBet, setShowChangeBet] = useState(0); // z-index

    useEffect(() => {

        socket.on('update_coin', (room) => {
            let PLAYER_KEYS = ['firstPlayer', 'secondPlayer', 'thirdPlayer', 'fourthPlayer', 'fifthPlayer', 'sixthPlayer', 'seventhPlayer', 'eighthPlayer', 'ninthPlayer', 'ownerOfRoom'];
            PLAYER_KEYS.forEach((key) => {
                if (room[key]?.userName === user.userName) {
                    dispatch(setCoin(room[key].coin));
                }
            })
        })

        socket.on('update_bet', (userName, bet) => {
            if (userName === user.userName) {
                Toast.show("Tiền cược đặt thành: " + formatCoin(bet) + " vì chủ phòng không đủ tiền !", Toast.LONG);
            }
        })

        socket.on('set_position', (userName, position) => {
            if (userName === user.userName) {
                dispatch(setPosition(position));
            }
        })

        socket.on('disconnect', () => {
            Alert.alert('Mất kết nối!');
            leaveTable();
        })

        // if (props.route.params.isReconnect) { // user reconnect
        //     socketController.userReconnect(room.roomName, user.userName, room.playerKey); // send emit to the server
        // }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", async () => {
            Alert.alert("Cảnh báo", "Bạn muốn rời phòng ư?", [
                {
                    text: "Không",
                    onPress: () => null,
                    style: "cancel"
                },
                {
                    text: "Đúng", onPress: leaveTable
                }
            ]);
            return true;
        });

        return () => {
            backHandler.remove();
            socket.off('update_coin');
            socket.off('set_position');
            socket.off('update_bet');
            socket.off('disconnect');
        }
    }, []);

    const onShowChangeBet = () => {
        setShowChangeBet(2);
    }

    const onHideChangeBet = (message) => {
        setShowChangeBet(0);
        Toast.show(message);
    }

    const leaveTable = async () => {
        await dispatch(resetRoomState());
        socketController.leaveRoom(room.roomName, user.userName);
        props.navigation.navigate('AllRooms');
    }

    return (
        <ImageBackground
            style={{ flex: 1, backgroundColor: 'purple', zIndex: 1 }}
            source={require('../assets/img/Tiles.png')}
            resizeMode="repeat"
        >
            {
                room.roomName && room.playerKey && (
                    <View style={{ flex: 1 }} >
                        <View style={{ width: Dimensions.get('window').width, height: 50 }}>
                            <StatusBarGame
                                onShowChangeBet={onShowChangeBet}
                                leaveTable={leaveTable}
                            ></StatusBarGame>
                        </View>

                        <GameContainer
                            style={{ flex: 1, zIndex: 1 }}
                            leaveTable={leaveTable}
                        ></GameContainer>

                        {
                            showChangeBet === 2 ? (
                                <View
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(10,10,10,0.5)',
                                        zIndex: showChangeBet,
                                        position: 'absolute',
                                    }}
                                >
                                    <ShowChangeBet
                                        onHideChangeBet={onHideChangeBet}
                                        minBet={props.route.params.minBet}
                                    ></ShowChangeBet>
                                </View>
                            ) : null
                        }
                    </View>
                )
            }
        </ImageBackground>
    )
}