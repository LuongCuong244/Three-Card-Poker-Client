import React, { useState, useEffect } from "react";
import { StyleSheet, Animated, Text, Dimensions, Platform, KeyboardAvoidingView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { GiftedChat, Avatar, Bubble, Send, InputToolbar } from "react-native-gifted-chat/";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import socketController from '../../socketIO/socket.controller';
import { useSelector } from 'react-redux';
import {
    selectUser,
} from '../../slices/user.slices';
import { selectChat } from "../../slices/chat.slices";

export default function WorldChat(props) {

    const user = useSelector(selectUser);
    const chat = useSelector(selectChat);

    const [anim, setAnim] = useState(new Animated.Value(-Dimensions.get('window').width));

    useEffect(() => {
        animIn();
    }, [])

    const animIn = () => {
        Animated.spring(anim, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    }

    const animOut = () => {
        Animated.timing(anim, {
            toValue: -Dimensions.get('window').width,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            props.setShowMessages(false);
        });
    }

    const onSend = (messages = []) => {
        let text = messages[0].text.trim();
        if (text.length < 1) {
            return false;
        }

        socketController.sendMessToWorldChat({
            _id: messages[0]._id,
            createAt: new Date(),
            user: messages[0].user,
            text: messages[0].text.trim()
        })
    }

    const renderAvatar = (props) => {
        return (
            <Avatar
                {...props}
                imageStyle={{
                    left: {
                        height: 35,
                        width: 35,
                        borderRadius: 25
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
                        inputRange: [- Dimensions.get('window').width, 0],
                        outputRange: [0, 1],
                    })
                }
            ]}
            onStartShouldSetResponder={onClickOutside}
        >
            <Animated.View
                style = {{
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
                        colors={['#0bab64', '#3bb78f']}
                    >
                        <Text style={styles.title}>{"Tin nhắn"}</Text>
                    </LinearGradient>

                    <LinearGradient
                        style={styles.messageContainer}
                        colors={['#ebbe9b', '#e7a977']}
                    >
                        <GiftedChat
                            messages={chat.worldChatMes}
                            user={{
                                _id: user.userName,
                                name: user.userName,
                                avatar: user.avatar,
                            }}
                            onSend={onSend}
                            maxInputLength={100}
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
                    </LinearGradient>
                </LinearGradient>
            </Animated.View>
        </Animated.View >
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
        flex: 1,
        width: '100%',
        paddingTop: 10,
    },
})