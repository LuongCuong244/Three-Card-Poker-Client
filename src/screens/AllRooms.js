import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert, Image, BackHandler, Dimensions, Modal, ImageBackground } from "react-native";
import RoomItem from "../components/AllRooms/RoomItem";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import CreateRoom from "../components/AllRooms/CreateRoom";
import socket from '../config/socket.config';
import socketController from '../socketIO/socket.controller';
import LinearGradient from "react-native-linear-gradient";
import WorldChat from "../components/AllRooms/WorldChat";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import ShowFindRoom from "../components/AllRooms/ShowFindRoom";
import RoomApi from "../api/room.api";
import { useSelector, useDispatch } from 'react-redux';
import {
    selectUser,
} from '../slices/user.slices';
import { selectChat, setWorldChatMes, addMesWorldChat } from "../slices/chat.slices";

export default function AllRooms(props) {

    const user = useSelector(selectUser);
    const chat = useSelector(selectChat);
    const dispatch = useDispatch();

    const [rooms, setRooms] = useState([]);
    const stateRefRooms = useRef();

    const [listDisplayRoom, setListDisplayRoom] = useState([]);
    const [widthFlatList, setWidthFlatList] = useState(150);
    const [numberColumsFlatList, setNumberColumsFlatList] = useState(4);

    const [createRoomShow, setCreateRoomShow] = useState(false);
    const [showFindRoom, setShowFindRoom] = useState(0);

    const [heightOptionsContainer, setHeightOptionsContainer] = useState(250);

    const [selecting, setSelecting] = useState('all-room');
    const stateRefSelecting = useRef('all-room');

    const [showWorldChat, setShowWorldChat] = useState(false);
    const [unseenMessagesNumber, setUnseenMessagesNumber] = useState(0);
    const stateRefShowMess = useRef(false);
    const stateRefUnseen = useRef(0);

    useEffect(() => {

        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            props.navigation.navigate('Home');
            return true;
        });

        RoomApi.getAllRooms()
            .then(async (res) => {
                if (res.data.error) {
                    Alert.alert(res.data.error);
                    return;
                }
                await setRooms(res.data.allRooms);
                stateRefRooms.current = res.data.allRooms;
                loadAllRooms();
            })

        socketController.getMesWorldChat();

        socket.on('all_mes_world_chat', (allMes) => {
            dispatch(setWorldChatMes(allMes.reverse()));
        })

        socket.on('update_messages_in_world_chat', (newMessage) => {
            dispatch(addMesWorldChat(newMessage));
        })

        socket.on('send_AllRooms', async (data) => {
            await setRooms(data.allRooms);
            stateRefRooms.current = data.allRooms;

            switch (stateRefSelecting.current) {
                case 'all-room': {
                    loadAllRooms();
                    break;
                }
                case 'no-password': {
                    loadRoomNoPassworld();
                    break;
                }
                case 'not-start': {
                    loadRoomNotStart();
                    break;
                }
                case 'enough-bets': {
                    loadRoomEnoughBets();
                    break;
                }
                case 'multiple-player': {
                    loadRoomMultiplePlayer();
                    break;
                }
                default:
                    loadAllRooms();
            }
        })
        socket.on('update_unseen_messages_number_world_chat', (message) => {
            if (stateRefShowMess.current == false) {
                stateRefUnseen.current += 1;
                setUnseenMessagesNumber(stateRefUnseen.current);
            }
        })

        return () => {
            backHandler.remove();
            socket.off('all_mes_world_chat');
            socket.off('send_AllRooms');
            socket.off('update_unseen_messages_number_world_chat');
            socket.off('update_messages_in_world_chat');
        }
    }, []);

    const setShowCreateRoom = (value) => {
        setCreateRoomShow(value);
    }

    const setShowMessagesWorldChat = (value) => {
        stateRefShowMess.current = value;
        setShowWorldChat(value);
    }

    const setValueOfSelecting = (value) => {
        setSelecting(value);
        stateRefSelecting.current = value;
    }

    const setShowFindRoomZIndex = (value, room) => {
        setShowFindRoom(value);
        if (room) {
            let arr = [];
            arr.push(room);
            setListDisplayRoom(arr);

            setValueOfSelecting('all-room');
        }
    }

    const loadAllRooms = () => {
        setListDisplayRoom(stateRefRooms.current);
    }

    const loadRoomNoPassworld = () => {
        setListDisplayRoom(stateRefRooms.current.filter(item => item.havePassword === "No"));
    }

    const loadRoomNotStart = () => {
        setListDisplayRoom(stateRefRooms.current.filter(item => item.isRunning === false));
    }

    const loadRoomEnoughBets = async () => {
        setListDisplayRoom(stateRefRooms.current.filter(item => item.minBet <= user.coin));
    }

    const loadRoomMultiplePlayer = () => {
        setListDisplayRoom(stateRefRooms.current.filter(item => item.playersInRoom.length >= 5));
    }

    return (
        <LinearGradient
            style={styles.viewContainer}
            colors={['#5ee7df', '#b490ca']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
        >
            <CreateRoom
                isShow={createRoomShow}
                setVisible={setShowCreateRoom}
                navigation={props.navigation}
            ></CreateRoom>

            <View style={styles.toolBar} >
                <View style={styles.closeView}>
                    <TouchableOpacity
                        style={styles.styleIcon}
                        activeOpacity={0.7}
                        onPress={() => {
                            props.navigation.navigate('Home');
                        }}
                    >
                        <FontAwesome5 name='arrow-left' size={35} color='rgb(50,50,50)'></FontAwesome5>
                    </TouchableOpacity>
                </View>

                <View style={styles.tool} >

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            if (showFindRoom === 0) {
                                setShowFindRoomZIndex(2);
                            }
                        }}
                        style={styles.searchButton}
                    >
                        <FontAwesome name="search" size={20} color={'white'} ></FontAwesome>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.createButtonContainer}
                        onPress={() => {
                            setCreateRoomShow(true);
                        }}
                    >
                        <LinearGradient
                            style={styles.createButtonLinear}
                            colors={['#8430ec', '#6217bf']}
                        >
                            <Text style={styles.createButtonText} >Tạo phòng</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={styles.coinContainer} >
                    <LinearGradient
                        style={styles.coinBackground}
                        colors={['#1e3b70', '#29539b']}
                    >
                        <Text style={styles.coinText} >{user?.coin < 1000000000 ? formatCoin(user?.coin) : formatCoinByLetter(user?.coin)}</Text>
                    </LinearGradient>
                    <Image
                        style={styles.coinIcon}
                        source={require('../assets/img/CoinIcon.png')}
                    ></Image>
                </View>
            </View>

            <View style={styles.mainDisplay} >
                <View
                    style={styles.displayOptions}
                    onLayout={(even) => {
                        setHeightOptionsContainer(even.nativeEvent.layout.height)
                    }}
                >
                    <TouchableOpacity
                        style={[styles.optionButton, { height: (heightOptionsContainer - 90) / 5 }]}
                        activeOpacity={0.7}
                        onPress={() => {
                            if (stateRefSelecting.current !== 'all-room') {
                                setValueOfSelecting('all-room');
                                loadAllRooms();
                            }
                        }}
                    >
                        <View style={stateRefSelecting.current === 'all-room' ? styles.optionLinear_On : styles.optionLinear_Off} >
                            <Text style={stateRefSelecting.current === 'all-room' ? styles.optionText_On : styles.optionText_Off} >Tất cả phòng</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.optionButton, { height: (heightOptionsContainer - 90) / 5 }]}
                        activeOpacity={0.7}
                        onPress={() => {
                            if (stateRefSelecting.current !== 'no-password') {
                                setValueOfSelecting('no-password');
                                loadRoomNoPassworld();
                            }
                        }}
                    >
                        <View style={stateRefSelecting.current === 'no-password' ? styles.optionLinear_On : styles.optionLinear_Off} >
                            <Text style={stateRefSelecting.current === 'no-password' ? styles.optionText_On : styles.optionText_Off} >Không mật khẩu</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.optionButton, { height: (heightOptionsContainer - 90) / 5 }]}
                        activeOpacity={0.7}
                        onPress={() => {
                            if (stateRefSelecting.current !== 'not-start') {
                                setValueOfSelecting('not-start');
                                loadRoomNotStart();
                            }
                        }}
                    >
                        <View style={stateRefSelecting.current === 'not-start' ? styles.optionLinear_On : styles.optionLinear_Off} >
                            <Text style={stateRefSelecting.current === 'not-start' ? styles.optionText_On : styles.optionText_Off} >Chưa chơi</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.optionButton, { height: (heightOptionsContainer - 90) / 5 }]}
                        activeOpacity={0.7}
                        onPress={() => {
                            if (stateRefSelecting.current !== 'enough-bets') {
                                setValueOfSelecting('enough-bets');
                                loadRoomEnoughBets();
                            }
                        }}
                    >
                        <View style={stateRefSelecting.current === 'enough-bets' ? styles.optionLinear_On : styles.optionLinear_Off} >
                            <Text style={stateRefSelecting.current === 'enough-bets' ? styles.optionText_On : styles.optionText_Off} >Đủ tiền cược</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.optionButton, { height: (heightOptionsContainer - 90) / 5 }]}
                        activeOpacity={0.7}
                        onPress={() => {
                            if (stateRefSelecting.current !== 'multiple-player') {
                                setValueOfSelecting('multiple-player');
                                loadRoomMultiplePlayer();
                            }
                        }}
                    >
                        <View style={stateRefSelecting.current === 'multiple-player' ? styles.optionLinear_On : styles.optionLinear_Off} >
                            <Text style={stateRefSelecting.current === 'multiple-player' ? styles.optionText_On : styles.optionText_Off} >Nhiều người chơi</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {
                    listDisplayRoom.length !== 0 ? (
                        <FlatList
                            data={listDisplayRoom}
                            numColumns={numberColumsFlatList}
                            onLayout={(even) => {
                                setWidthFlatList(even.nativeEvent.layout.width);
                            }}
                            renderItem={(roomItem) => {
                                return (
                                    <RoomItem
                                        navigation={props.navigation}
                                        widthFlatList={widthFlatList}
                                        roomItem={roomItem.item}
                                        numberColums={numberColumsFlatList}
                                    ></RoomItem>
                                )
                            }}
                            contentContainerStyle={styles.flatListStyle}
                            keyExtractor={(item) => item.roomName}
                        ></FlatList>
                    ) : (
                        <View style={[styles.flatListStyle, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={styles.notificationText} >Không có bàn nào được hiển thị!</Text>
                        </View>
                    )
                }
            </View>
            <View style={styles.chatContainer} >
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        setShowMessagesWorldChat(true);
                        setUnseenMessagesNumber(0);
                    }}
                >
                    <ImageBackground
                        source={require('../assets/img/Icon/Message_Icon.png')}
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
                <View style={styles.borderChat} >
                    <Modal
                        animationType='none'
                        visible={showWorldChat}
                        transparent={true}
                        statusBarTranslucent
                    >
                        <WorldChat
                            setShowMessages={setShowMessagesWorldChat}
                        ></WorldChat>
                    </Modal>
                    {
                        chat.worldChatMes.length > 0 ? (
                            <View style={styles.informationMessage}>
                                <Text style={styles.userNameOfMessage} >{chat.worldChatMes[0].user.name}:</Text>
                                <Text
                                    style={styles.textOfMessage}
                                    numberOfLines={1}
                                >{chat.worldChatMes[0].text}</Text>
                            </View>
                        ) : (
                            <Text style={[styles.textOfMessage, { color: 'gray', fontSize: 15, fontStyle: 'italic' }]}>Không có tin nhắn nào được hiển thị</Text>
                        )
                    }
                </View>
            </View>

            {
                showFindRoom === 2 ? (
                    <View
                        style={{
                            width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)',
                            zIndex: showFindRoom,
                            position: 'absolute',
                        }}
                    >
                        <ShowFindRoom
                            setShowFindRoom={setShowFindRoomZIndex}
                        ></ShowFindRoom>
                    </View>
                ) : null
            }
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: '#95a5a6',
        marginTop: 2,
        flex: 1,
        alignItems: 'center'
    },
    toolBar: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    closeView: {
        height: '100%',
        width: 240,
        flexDirection: 'row',
    },
    styleIcon: {
        height: '100%',
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinContainer: {
        height: '100%',
        width: 190,
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinBackground: {
        flex: 1,
        height: 35,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        left: 15
    },
    coinText: {
        letterSpacing: 0,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffd700',
        left: 10,
    },
    coinIcon: {
        width: 40,
        height: 40,
        right: 10,
    },
    tool: {
        flex: 1,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchButton: {
        width: 40,
        height: 40,
        marginRight: 15,
        marginLeft: 3,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3da4ab',
        borderWidth: 1,
        borderColor: '#adcbe3'
    },
    createButtonContainer: {
        width: 120,
        height: 40,
    },
    createButtonLinear: {
        width: '100%',
        flex: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createButtonText: {
        letterSpacing: 1,
        fontSize: 16,
        fontWeight: '800',
        color: 'white',
    },
    mainDisplay: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
    },
    displayOptions: {
        height: '100%',
        width: 240,
        alignItems: 'center',
    },
    optionButton: {
        width: '80%',
        height: 33,
        marginTop: 15,
    },
    optionLinear_On: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#4e74ff',
        shadowColor: 'white',
        shadowRadius: 16,
        shadowOpacity: 0.7,
        shadowOffset: { width: 0, height: 12 },
        elevation: 12,
    },
    optionLinear_Off: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#e3e6e8',
        shadowColor: 'white',
        shadowRadius: 16,
        shadowOpacity: 0.7,
        shadowOffset: { width: 0, height: 12 },
        elevation: 12,
    },
    optionText_On: {
        letterSpacing: 1,
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
    },
    optionText_Off: {
        letterSpacing: 1,
        fontSize: 18,
        fontStyle: 'italic',
        color: '#888f9a',
    },
    chatContainer: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    borderChat: {
        height: 45,
        width: Dimensions.get('window').width - 310,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: 'rgba(255,255,255,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    informationMessage: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    userNameOfMessage: {
        fontSize: 20,
        color: '#005b96',
        fontWeight: 'bold',
    },
    textOfMessage: {
        fontSize: 18,
        color: 'rgb(50,50,50)',
        fontStyle: 'italic',
        marginLeft: 3,
        flex: 1,
    },
    messageIcon: {
        width: 45,
        height: 45,
        marginRight: 15,
        alignItems: 'flex-end'
    },
    unseenMessagesView: {
        width: '50%',
        height: '50%',
        backgroundColor: 'red',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        left: '25%',
        bottom: '10%'
    },
    unseenMessagesText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold'
    },
    flatListStyle: {
        flex: 1,
        height: '100%',
        padding: 10,
        marginRight: 10,
        borderWidth: 3,
        borderRadius: 20,
        borderColor: 'white',
        backgroundColor: 'rgba(230,230,234,0.3)'
    },
    notificationText: {
        fontSize: 20,
        color: 'gray',
        fontStyle: 'italic',
        textAlign: 'center',
    },
})