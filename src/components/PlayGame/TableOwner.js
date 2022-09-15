import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, ImageBackground, Image, TouchableOpacity, Text, Dimensions, Animated } from "react-native";
import showCard from "../../modules/ShowCard";
import showScore from "../../modules/ShowScore";
import formatCoinByLetter from '../../modules/FormatCoinByLetter';
import socketController from '../../socketIO/socket.controller';
import socket from '../../config/socket.config';
import { useSelector, shallowEqual } from 'react-redux';
import { selectRoom } from "../../slices/room.slices";

const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;

export default function TableOwner(props) {

    const room = useSelector(selectRoom, shallowEqual);
    const userData = room[props.keyword];

    const countDown = useRef();
    const timeOut = useRef();

    const [widthAvatarContainer, setWidthAvatarContainer] = useState(40);
    const [heightAvatarContainer, setHeightAvatarContainer] = useState(100);

    const [time, setTime] = useState(15);
    const stateRefTime = useRef(15);

    const [scaleAnim, setScaleAnim] = useState(new Animated.Value(0.8));

    const [stopAnim, setStopAnim] = useState(false);
    const stateRefStopAnim = useRef(false);

    useEffect(() => {

        socket.on('start_running_game', () => {
            startCountDown();
        })

        socket.on('hide_countdown', () => {
            resetCountDown();
        })

        // socket.on('set_game_time', async (time) => {
        //     if(!time){
        //         return;
        //     }
        //     await setTime(time);
        //     stateRefTime.current = time;
        //     startCountDown();
        // })

        if (stateRefStopAnim.current) {
            stateRefStopAnim.current = false;
            setStopAnim(stateRefStopAnim.current);
        }

        scaleIn();

        return () => {
            socket.off('start_running_game');
            socket.off('hide_countdown');
            socket.off('set_game_time');

            clearTimeout(timeOut.current);
            clearInterval(countDown.current);
        }
    }, []);

    const resetCountDown = () => {
        clearInterval(countDown.current);
        setTime(15);
        stateRefTime.current = 15;
    }

    const startCountDown = () => {
        if (countDown.current) {
            clearInterval(countDown.current);
        }
        countDown.current = setInterval(() => {
            if (stateRefTime.current <= 0) {
                resetCountDown();
            } else {
                stateRefTime.current -= 1;
                setTime(stateRefTime.current);
            }
        }, 1000)
    }

    const scaleIn = () => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            if (!stateRefStopAnim.current) {
                scaleOut();
            }
        });
    };

    const scaleOut = () => {
        Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            if (!stateRefStopAnim.current) {
                scaleIn();
            }
        });
    };

    const onSetDimenstions = (event) => {
        setWidthAvatarContainer(event.nativeEvent.layout.width);
        setHeightAvatarContainer(event.nativeEvent.layout.height);
    }

    const onShowInfor = () => {
        props.showPlayerInfor(userData?.userName);
    }

    const onPressFirstCard = () => {
        if (props.isMySeat && !userData?.flipFirstCard) {
            socketController.flipCard(room.roomName, 'First', room.playerKey);
        }
    }

    const onPressSecondCard = () => {
        if (props.isMySeat && !userData?.flipSecondCard) {
            socketController.flipCard(room.roomName, 'Second', room.playerKey);
        }
    }

    const onPressThirdCard = () => {
        if (props.isMySeat && !userData?.flipThirdCard) {
            socketController.flipCard(room.roomName, 'Third', room.playerKey);
        }
    }

    return (
        <View style={{ height: 240, width: 120 }}>
            <ImageBackground
                style={[styles.imageTableOwner, { borderWidth: props.isMySeat ? 2 : 0 }]}
                source={require('../../assets/img/10.png')}
            >
                {
                    userData?.userName != null && (
                        <View style={styles.imageTableOwner}>
                            <View style={styles.imageAvatarContainer}
                                onLayout={onSetDimenstions}
                            >
                                <View style={{ width: '100%', height: (heightAvatarContainer - 0.75 * widthAvatarContainer - 2) / 2, }}>

                                    <View style={styles.containerName}>
                                        <Text style={styles.textName} >{userData?.userName}</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{ height: 0.75 * widthAvatarContainer, width: 0.75 * widthAvatarContainer }}
                                    onPress={onShowInfor}
                                >
                                    <Image
                                        style={[styles.avatar, {
                                            width: 0.75 * widthAvatarContainer, height: 0.75 * widthAvatarContainer
                                        }]}
                                        source={{ uri: userData?.avatar }}
                                    ></Image>
                                </TouchableOpacity>

                                <View style={styles.coinBet} >
                                    <Text style={styles.textCoin} >{formatCoinByLetter(userData?.coin)}</Text>
                                </View>

                                {
                                    time < 15 && (
                                        <View
                                            style={[{
                                                width: widthAvatarContainer,
                                                height: widthAvatarContainer,
                                            }, styles.timeContainer]}
                                        >
                                            <Text style={styles.textTime} >{time}</Text>
                                        </View>
                                    )
                                }
                            </View>

                            {
                                userData?.firstCard && userData?.secondCard && userData?.thirdCard && (
                                    <View style={styles.displayInformation}>
                                        <TouchableOpacity
                                            activeOpacity={props.isMySeat ? 0.8 : 1}
                                            onPress={onPressFirstCard}
                                        >
                                            <Image
                                                style={{
                                                    width: ((widthScreen - 120) / (heightScreen - 40)) > (285 / 160) ? (0.56 * (285 / 160) * (((heightScreen - 40) - 40) / 3) - 20) / 3 : (0.56 * (((widthScreen - 120) - 40) / 3) - 20) / 3, // giải thích trong phần comment ở dưới
                                                    height: (((widthScreen - 120) / (heightScreen - 40)) > (285 / 160) ? (0.56 * (285 / 160) * (((heightScreen - 40) - 40) / 3) - 20) / 3 : (0.56 * (((widthScreen - 120) - 40) / 3) - 20) / 3) * (240 / 155),
                                                    transform: [{ rotate: '270deg' }],
                                                    marginTop: '50%'
                                                }}
                                                source={showCard(userData?.flipFirstCard ? userData?.firstCard : 'hide')}
                                            ></Image>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            activeOpacity={props.isMySeat ? 0.8 : 1}
                                            onPress={onPressSecondCard}
                                        >
                                            <Image
                                                style={{
                                                    width: ((widthScreen - 120) / (heightScreen - 40)) > (285 / 160) ? (0.56 * (285 / 160) * (((heightScreen - 40) - 40) / 3) - 20) / 3 : (0.56 * (((widthScreen - 120) - 40) / 3) - 20) / 3, // giải thích trong phần comment ở dưới
                                                    height: (((widthScreen - 120) / (heightScreen - 40)) > (285 / 160) ? (0.56 * (285 / 160) * (((heightScreen - 40) - 40) / 3) - 20) / 3 : (0.56 * (((widthScreen - 120) - 40) / 3) - 20) / 3) * (240 / 155),
                                                    transform: [{ rotate: '270deg' }],
                                                    bottom: '15%',
                                                }}
                                                source={showCard(userData?.flipSecondCard ? userData?.secondCard : 'hide')}
                                            ></Image>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            activeOpacity={props.isMySeat ? 0.8 : 1}
                                            onPress={onPressThirdCard}
                                        >
                                            <Image
                                                style={{
                                                    width: ((widthScreen - 120) / (heightScreen - 40)) > (285 / 160) ? (0.56 * (285 / 160) * (((heightScreen - 40) - 40) / 3) - 20) / 3 : (0.56 * (((widthScreen - 120) - 40) / 3) - 20) / 3, // giải thích trong phần comment ở dưới
                                                    height: (((widthScreen - 120) / (heightScreen - 40)) > (285 / 160) ? (0.56 * (285 / 160) * (((heightScreen - 40) - 40) / 3) - 20) / 3 : (0.56 * (((widthScreen - 120) - 40) / 3) - 20) / 3) * (240 / 155),
                                                    transform: [{ rotate: '270deg' }],
                                                    bottom: '30%',
                                                }}
                                                source={showCard(userData?.flipThirdCard ? userData?.thirdCard : 'hide')}
                                            ></Image>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        </View>
                    )}
            </ImageBackground>

            {
                userData?.firstCard && userData?.secondCard && userData?.thirdCard &&
                userData?.flipFirstCard && userData?.flipSecondCard && userData?.flipThirdCard &&
                (
                    <View style={[styles.styleModal, { bottom: '37%', left: '10%' }]}>
                        <View>
                            <Animated.Image
                                style={
                                    [styles.styleImageScores,
                                    {
                                        transform: [
                                            {
                                                scale: scaleAnim
                                            }
                                        ]
                                    }]}
                                source={showScore(
                                    parseInt(userData?.firstCard.charAt(userData?.firstCard.length - 1)) +
                                    parseInt(userData?.secondCard.charAt(userData?.secondCard.length - 1)) +
                                    parseInt(userData?.thirdCard.charAt(userData?.thirdCard.length - 1))
                                )}
                            ></Animated.Image>
                        </View>
                    </View>
                )
            }

            {
                userData?.confirmBet ?
                    (
                        <View style={styles.styleModal} >
                            <Text style={{ fontSize: 18, fontWeight: '700', color: 'yellow', right: '20%', bottom: '25%', backgroundColor: 'red', padding: 5 }}>Sẵn sàng</Text>
                        </View>
                    ) : null
            }
        </View>
    )
}


// width/height = 285/160
// padding 10

// let heightChildTable;
// let widthChildTable;

// if ((widthScreen - 120) / (heightScreen - 40) > (285 / 160)) {
//     // tỷ lệ height nhỏ hơn, tính theo height
//     heightChildTable = ((heightScreen - 40) - 40) / 3;
//     widthChildTable = (285 / 160) * heightChildTable;
// } else {
//     // tỷ lệ width nhỏ hơn, tính theo width
//     widthChildTable = ((widthScreen - 120) - 40) / 3;
//     heightChildTable = (160 / 285) * widthChildTable;
// }

// Mục đích để lấy kích thước của quân bài width =( 0.66*widthChildTable - 20)/3
//                                        height = width*(240/155)



const styles = StyleSheet.create({
    imageTableOwner: {
        height: 240,
        width: 120,
        flexDirection: 'row-reverse',
        zIndex: 1,
        position: 'absolute',
        borderColor: 'tomato',
        borderRadius: 20,
    },
    displayInformation: {
        flex: 1,
        height: '100%',
        alignItems: 'center'
    },
    imageAvatarContainer: {
        height: '100%',
        width: '45%',
        alignItems: 'center',
    },
    avatar: {
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'white',
    },
    containerName: {
        width: '220%',
        right: '120%',
        bottom: 10,
        height: 23,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textName: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        color: 'rgb(50,50,50)',
        textAlign: 'center',
        borderRadius: 100,
        fontSize: 15
    },
    coinBet: {
        width: 90,
        marginTop: 25,
        right: 25,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'green',
        borderRadius: 10,
        padding: 2,
        top: '20%'
    },
    textCoin: {
        fontWeight: 'bold',
        color: '#ffd700',
        textAlign: 'center',
        fontSize: 16,
        bottom: 1
    },
    timeContainer: {
        borderRadius: 200,
        backgroundColor: 'rgb(0,0,128)',
        marginRight: "90%",
        marginTop: 10,
        borderColor: 'yellow',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        top: '5%'
    },
    textTime: {
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    styleModal: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        zIndex: 2,
        position: 'absolute',
    },
    styleImageScores: {
        width: 90,
        height: 90,
    }
})