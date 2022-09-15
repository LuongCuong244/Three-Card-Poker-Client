import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, Animated, Text, Dimensions, KeyboardAvoidingView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { GiftedChat, Avatar, Bubble, Send, InputToolbar } from "react-native-gifted-chat/";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import socketController from '../../socketIO/socket.controller';
import { useSelector } from 'react-redux';
import {
    selectUser,
} from '../../slices/user.slices';
import { selectRoom } from "../../slices/room.slices";
import { selectChat } from "../../slices/chat.slices";

export default function ChatRoom(props) {

    const user = useSelector(selectUser);
    const room = useSelector(selectRoom);
    const chat = useSelector(selectChat);

    const [anim, setAnim] = useState(new Animated.Value(-Dimensions.get('window').width * 0.6));

    useEffect(() => {
        animIn();
    }, []);

    const animIn = () => {
        Animated.spring(anim, {
            toValue: 0,
            bounciness: 13,
            useNativeDriver: true,
        }).start();
    }

    const animOut = () => {
        Animated.timing(anim, {
            toValue: -Dimensions.get('window').width * 0.6,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            props.onSetShowMessages(false);
        });
    }

    const _onSend = (messages = []) => {
        let text = messages[0].text.trim();
        if (text.length < 1) {
            return false;
        }
        socketController.sendMessToRoom({
            _id: messages[0]._id,
            createAt: new Date(),
            user: messages[0].user,
            text: messages[0].text,
        }, room.roomName);
    }

    const renderAvatar = (props) => {
        return (
            <Avatar
                {...props}
                imageStyle={{
                    left: {
                        height: 35,
                        width: 35,
                    }
                }}
            ></Avatar>
        )
    }

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#2e64e5', // màu background tin nhắn
                    }
                }}
                textStyle={{
                    right: {
                        color: '#fff', // màu chữ tin nhắn
                    },
                }}
                usernameStyle={{ color: '#009688' }}
            ></Bubble>
        )
    }

    const renderSend = (props) => {
        return (
            <Send
                {...props}
                disabled={!props.text}
                containerStyle={{
                    width: 44,
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <FontAwesome5 name="arrow-right" size={25} color={'#4c74b4'} ></FontAwesome5>
            </Send>
        );
    }

    const renderInputToolbar = (props) => {
        return (
            <InputToolbar
                {...props}
                containerStyle={{
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                primaryStyle={{ alignItems: 'center' }}
            />
        );
    }

    const onClickOutside = (even) => {
        if (even.nativeEvent.locationX > Dimensions.get('window').width * 0.6) {
            animOut();
        }
    }

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: anim.interpolate({
                        inputRange: [- Dimensions.get('window').width * 0.6, 0],
                        outputRange: [0, 1],
                    })
                }
            ]}
            onStartShouldSetResponder={onClickOutside}
        >
            <Animated.View
                style={{
                    transform: [{
                        translateX: anim
                    }],
                }}
            >
                <LinearGradient
                    style={styles.linearBackground}
                    colors={['#d387ab', '#e899dc']}
                >
                    <LinearGradient
                        style={styles.linearTitle}
                        colors={['#7f5a83', '#2a648e']}
                    >
                        <Text style={styles.title}>{'Tin nhắn'}</Text>
                    </LinearGradient>

                    <View style={styles.messageContainer}>
                        <View style={{ flex: 1 }} >
                            <GiftedChat
                                messages={chat.chatRoomMes}
                                user={{
                                    _id: user.userName,
                                    name: user.userName,
                                    avatar: user.avatar,
                                }}
                                onSend={_onSend}
                                maxInputLength={50}
                                renderAvatar={renderAvatar}
                                renderBubble={renderBubble}
                                renderSend={renderSend}
                                renderInputToolbar={renderInputToolbar}
                                placeholder='Nhập tin nhắn'
                                renderUsernameOnMessage={true}
                                showAvatarForEveryMessage={false}
                                alwaysShowSend={true}
                            />
                            {
                                Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
                            }
                        </View>
                    </View>
                </LinearGradient>
            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    linearBackground: {
        width: '60%',
        height: '100%',
        borderColor: 'white',
        borderWidth: 1,
    },
    linearTitle: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: 'white'
    },
    messageContainer: {
        flexDirection: 'row',
        paddingTop: 10,
        flex: 1,
        width: '100%',
    },
})