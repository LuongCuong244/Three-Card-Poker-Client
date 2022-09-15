import React, { Component, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text, Alert, Image, Modal, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import formatCoin from '../../modules/FormatCoin';
import formatCoinByLetter from '../../modules/FormatCoinByLetter';
import socketController from '../../socketIO/socket.controller';
import socket from '../../config/socket.config';
import ChatRooms from "./ChatRooms";
import { useSelector, useDispatch } from 'react-redux';
import {
    selectUser,
} from '../../slices/user.slices';
import { selectRoom } from "../../slices/room.slices";
import { addMesChatRoom, setChatRoomMes } from "../../slices/chat.slices";

export default function StatusBarGame(props) {

    const user = useSelector(selectUser);
    const room = useSelector(selectRoom);
    const dispatch = useDispatch();

    const [showMessages, setShowMessages] = useState(false);
    const [unseenMessagesNumber, setUnseenMessagesNumber] = useState(0);

    const stateRefShowMess = useRef(false);
    const stateRefUnseen = useRef(0);

    useEffect(() => {

        socketController.getRoomMessage(room.roomName);

        socket.on('all_mes_chat_room', (allMes) => {
            dispatch(setChatRoomMes(allMes));
        })

        socket.on('update_messages_chat_room', (newMessage) => {
            dispatch(addMesChatRoom(newMessage));
        })

        socket.on('update_unseen_messages_number', () => {
            if (stateRefShowMess.current == false) {
                stateRefUnseen.current += 1;
                setUnseenMessagesNumber(stateRefUnseen.current);
            }
        })

        return () => {
            socket.off('all_mes_chat_room');
            socket.off('update_unseen_messages_number');
            socket.off('update_messages');
        }
    }, [])

    function onSetShowMessages(value) {
        stateRefShowMess.current = value;
        setShowMessages(value);
    }

    function onBack() {
        Alert.alert("Cảnh báo", "Bạn có muốn rời khỏi phòng?", [
            {
                text: "Không",
                onPress: () => null,
                style: "cancel"
            },
            {
                text: "Có", onPress: props.leaveTable
            }
        ]);
    }

    function flipCards() {
        if (room[room.playerKey]?.firstCard) {
            socketController.flipCard(room.roomName, 'All', room.playerKey);
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.styleIcon}
                activeOpacity={0.7}
                onPress={onBack}
            >
                <FontAwesome5 name='arrow-left' size={32} color='white'></FontAwesome5>
            </TouchableOpacity>

            <View style={styles.messageContainer}>
                <Modal
                    animationType='none'
                    visible={showMessages}
                    transparent={true}
                    statusBarTranslucent
                >
                    <ChatRooms
                        onSetShowMessages={onSetShowMessages}
                    ></ChatRooms>
                </Modal>

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        onSetShowMessages(true);
                        setUnseenMessagesNumber(0);
                    }}
                >
                    <ImageBackground
                        source={require('../../assets/img/Icon/Message_Icon.png')}
                        style={styles.messageIcon}
                    >
                        {
                            unseenMessagesNumber > 0 ? (
                                <View style={styles.unseenMessagesView}>
                                    <Text style={styles.unseenMessagesText} >{unseenMessagesNumber < 10 ? unseenMessagesNumber : '9+'}</Text>
                                </View>
                            ) : null
                        }
                    </ImageBackground>
                </TouchableOpacity>
            </View>

            {
                room[room.playerKey]?.firstCard && (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.flipCardsButton}
                        onPress={flipCards}
                    >
                        <LinearGradient
                            style={styles.linear}
                            colors={['#e1415f', '#ee294e']}
                        >
                            <Text style={styles.text} >Lật bài</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )
            }

            {
                room.position !== 10 ? (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.changeBetButton}
                        onPress={props.onShowChangeBet}
                    >
                        <LinearGradient
                            style={styles.linear}
                            colors={['#26a942', '#30a348']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.text} >Đặt lại mức cược</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ) : null
            }

            <View style={styles.view}>
                <View style={styles.coinContainer} >
                    <LinearGradient
                        style={styles.coinBackground}
                        colors={['#1e3b70', '#29539b']}
                    >
                        <Text style={styles.coinText} >{user.coin < 1000000000 ? formatCoin(user.coin) : formatCoinByLetter(user.coin)}</Text>
                    </LinearGradient>
                    <Image
                        style={styles.coinIcon}
                        source={require('../../assets/img/CoinIcon.png')}
                    ></Image>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    styleIcon: {
        width: 50,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    messageContainer: {
        height: '100%',
        width: '25%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    messageIcon: {
        width: 42,
        height: 42,
        marginRight: 30,
        top: '5%',
        alignItems: 'flex-end'
    },
    unseenMessagesView: {
        width: '60%',
        height: '60%',
        backgroundColor: 'red',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        left: '25%',
        bottom: '10%'
    },
    unseenMessagesText: {
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold'
    },
    flipCardsButton: {
        width: 80,
        height: 35,
    },
    changeBetButton: {
        width: 150,
        height: 35,
        marginHorizontal: 15,
    },
    view: {
        height: '100%',
        flex: 1,
        paddingRight: 10,
        alignItems: 'flex-end',
    },
    coinContainer: {
        height: '100%',
        width: 155,
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
    },
    linear: {
        flex: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 1,
    },
    text: {
        fontSize: 13,
        letterSpacing: 1,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    coinBackground: {
        flex: 1,
        height: 27,
        borderRadius: 20,
        borderColor: 'white',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    coinText: {
        letterSpacing: 0,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#ffd700',
        left: 7,
    },
    coinIcon: {
        width: 32,
        height: 32,
        right: 20
    }
})