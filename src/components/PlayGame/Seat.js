import React, { useEffect, useState } from "react";
import { View, Dimensions, StyleSheet, ImageBackground, Text, TouchableOpacity, Image, Animated } from "react-native";
import showCard from "../../modules/ShowCard";
import formatCoinByLetter from "../../modules/FormatCoinByLetter";
import showScore from "../../modules/ShowScore";
import socketController from '../../socketIO/socket.controller';
import LinearGradient from "react-native-linear-gradient";
import formatCoin from "../../modules/FormatCoin";
import { useSelector, shallowEqual } from 'react-redux';
import { selectRoom } from "../../slices/room.slices";

export default function Seat(props) {

    const room = useSelector(selectRoom, shallowEqual);
    const userData = room[props.keyword];

    const [widthAvatarContainer, setWidthAvatarContainer] = useState(40);
    const [heightAvatarContainer, setHeightAvatarContainer] = useState(100);
    const [widthCardContainer, setWidthCardContainer] = useState(50);
    const [scaleAnim, setScaleAnim] = useState(new Animated.Value(0.8));
    const [stopAnimation, setStopAnimation] = useState(false);

    const [coinFontSize, setCoinFontSize] = useState(12);
    const [nameFontSize, setNameFontSize] = useState(12);

    useEffect(() => {
        scaleIn();
    },[]);

    const scaleIn = () => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            if (!stopAnimation) {
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
            if (!stopAnimation) {
                scaleIn();
            }
        });
    };

    const onSetDimensions = (event) => {
        setWidthAvatarContainer(event.nativeEvent.layout.width);
        setHeightAvatarContainer(event.nativeEvent.layout.height);
    }

    const onSetNameFontSize = (event) => {
        setNameFontSize(event.nativeEvent.layout.height * 0.5)
    }

    const onShowPlayerInfor = () => {
        props.showPlayerInfor(userData?.userName);
    }

    const onSetWidthCardContainer = (event) => {
        setWidthCardContainer(event.nativeEvent.layout.width);
    }

    const onSetCoinFontSize = (event) => {
        setCoinFontSize(event.nativeEvent.layout.height * 0.65)
    }

    const onPressFirstCard = () => {
        if ( props.isMySeat && !userData?.flipFirstCard) {
            socketController.flipCard(room.roomName, 'First', room.playerKey);
        }
    }

    const onPressSecondCard = () => {
        if ( props.isMySeat && !userData?.flipSecondCard) {
            socketController.flipCard(room.roomName, 'Second', room.playerKey);
        }
    }

    const onPressThirdCard = () => {
        if ( props.isMySeat && !userData?.flipThirdCard) {
            socketController.flipCard(room.roomName, 'Third', room.playerKey);
        }
    }

    return (
        <View>
            <ImageBackground
                style={[styles.imageChildTable, { marginHorizontal: 5, borderWidth: props.isMySeat ? 1 : 0 }]}
                source={require('../../assets/img/1.png')}
            >
                {userData?.userName != null && (
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View
                            style={styles.displayAvatar}
                            onLayout={onSetDimensions}
                        >
                            <View
                                style={[
                                    styles.containerName,
                                    {
                                        height: (heightAvatarContainer - 0.65 * widthAvatarContainer) / 2
                                    },
                                    userData?.flipFirstCard && userData?.flipSecondCard && userData?.flipThirdCard ? { width: '130%', left: '30%', } : { width: '210%', left: '110%', }
                                ]}
                                onLayout={onSetNameFontSize}
                            >
                                <Text style={[styles.textName, { fontSize: nameFontSize }]} >{userData?.userName}</Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{ height: 0.55 * widthAvatarContainer, width: 0.55 * widthAvatarContainer, marginRight: '7%', marginTop: '3%', borderRadius: 5 }}
                                onPress={onShowPlayerInfor}
                            >
                                <Image
                                    style={styles.avatar}
                                    source={{ uri: userData?.avatar }}
                                ></Image>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.displayInformation}
                            onLayout={onSetWidthCardContainer}
                        >
                            <View style={styles.coinBetContainer} >
                                <LinearGradient
                                    style={styles.coinBet}
                                    colors={['#045f99', '#0c86c1']}
                                    onLayout={onSetCoinFontSize}
                                >
                                    <Text style={[styles.textCoin, { fontSize: coinFontSize }]} >{userData?.bet >= 1000000 ? formatCoinByLetter(userData?.bet) : formatCoin(userData?.bet)}</Text>
                                </LinearGradient>
                            </View>
                            {
                                userData?.firstCard != null && userData?.secondCard != null && userData?.thirdCard != null && (
                                    <View style={styles.containerCard}>
                                        <TouchableOpacity
                                            activeOpacity={props.isMySeat ? 0.8 : 1}
                                            style={{ flex: 1, alignItems: 'center' }}
                                            onPress={onPressFirstCard}
                                        >
                                            <Image
                                                style={{
                                                    width: (widthCardContainer - 20) / 3,
                                                    height: ((widthCardContainer - 20) / 3) * (240 / 155),
                                                    borderRadius: 1
                                                }}
                                                source={showCard(userData?.flipFirstCard ? userData?.firstCard : 'hide')}
                                            ></Image>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            activeOpacity={props.isMySeat ? 0.8 : 1}
                                            style={{ flex: 1, marginLeft: 2.5 }}
                                            onPress={onPressSecondCard}
                                        >
                                            <Image
                                                style={{
                                                    width: (widthCardContainer - 20) / 3,
                                                    height: ((widthCardContainer - 20) / 3) * (240 / 155),
                                                    borderRadius: 1
                                                }}
                                                source={showCard(userData?.flipSecondCard ? userData?.secondCard : 'hide')}
                                            ></Image>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            activeOpacity={ props.isMySeat ? 0.8 : 1}
                                            style={{ flex: 1 }}
                                            onPress={onPressThirdCard}
                                        >
                                            <Image
                                                style={{
                                                    width: (widthCardContainer - 20) / 3,
                                                    height: ((widthCardContainer - 20) / 3) * (240 / 155),
                                                    borderRadius: 1
                                                }}
                                                source={showCard(userData?.flipThirdCard ? userData?.thirdCard : 'hide')}
                                            ></Image>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        </View>
                    </View>
                )}
            </ImageBackground>
            {
                userData?.status == 'Win' &&
                (
                    <View style={[styles.styleModal, { left: '7%' }]}>
                        <View>
                            <Animated.Image
                                style={
                                    [styles.imageStatusWin,
                                    {
                                        transform: [
                                            {
                                                scale: scaleAnim
                                            }
                                        ]
                                    }]}
                                source={require('../../assets/img/win.png')}
                            ></Animated.Image>
                        </View>
                    </View>
                )
            }

            {
                userData?.status == 'Lost' &&
                (
                    <View style={[styles.styleModal, { left: '11%' }]}>
                        <View>
                            <Animated.Image
                                style={
                                    [styles.imageStatusLost,
                                    {
                                        transform: [
                                            {
                                                scale: scaleAnim
                                            }
                                        ]
                                    }]}
                                source={require('../../assets/img/lost.png')}
                            ></Animated.Image>
                        </View>
                    </View>
                )
            }

            {
                userData?.firstCard != null && userData?.secondCard != null && userData?.thirdCard != null &&
                userData?.flipFirstCard && userData?.flipSecondCard && userData?.flipThirdCard &&
                (
                    <View style={styles.styleModal}>
                        <View style={styles.scoresContainer}>
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
                            <Text 
                                style={{ fontSize: 18, fontWeight: '700', color: 'pink', right: '6%' }}
                            >
                                {"Sẵn sàng"}
                            </Text>
                        </View>
                    ) : null
            }
        </View>
    )
}

// width/height = 285/160
// padding 10

const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;

let heightChildTable;
let widthChildTable;

if ((widthScreen - 120) / (heightScreen - 50) > (285 / 160)) {
    // tỷ lệ height nhỏ hơn, tính theo height
    heightChildTable = ((heightScreen - 50) - 40) / 3;
    widthChildTable = (285 / 160) * heightChildTable;
} else {
    // tỷ lệ width nhỏ hơn, tính theo width
    widthChildTable = ((widthScreen - 120) - 50) / 3;
    heightChildTable = (160 / 285) * widthChildTable;
}

const styles = StyleSheet.create({
    imageChildTable: {
        width: widthChildTable,
        height: heightChildTable,
        borderColor: 'tomato',
        borderRadius: 10,
        zIndex: 0
    },
    styleModal: {
        height: heightChildTable,
        width: widthChildTable,
        justifyContent: 'center',
        alignItems: 'flex-end',
        zIndex: 1,
        position: 'absolute',
    },
    imageStatusWin: {
        width: 0.7 * widthChildTable,
        height: 0.7 * widthChildTable * (108 / 358)
    },
    imageStatusLost: {
        width: 0.75 * widthChildTable,
        height: 0.75 * widthChildTable * (108 / 448),
    },
    displayInformation: {
        flex: 1,
        height: '100%',
        flexDirection: 'column-reverse'
    },
    containerCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    coinBetContainer: {
        width: '100%',
        height: '28%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinBet: {
        width: '90%',
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 5,
        padding: 2,
        marginTop: 10
    },
    textCoin: {
        fontWeight: 'bold',
        color: '#ffd700',
        textAlign: 'center',
        fontSize: 12,
        height: '120%',
        letterSpacing: 1,
        top: 1,
    },
    displayAvatar: {
        width: '44%',
        height: '100%',
        alignItems: 'flex-end',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'white',
    },
    containerName: {
        // width: '210%',
        // left: '110%',
        bottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 2,
    },
    textName: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        letterSpacing: 1,
        color: 'rgb(50,50,50)',
        textAlign: 'center',
        borderRadius: 100,
        fontSize: 12,
    },
    scoresContainer: {
        width: 0.25 * widthChildTable,
        height: 0.25 * widthChildTable,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: '31%',
        right: '13%',
    },
    styleImageScores: {
        width: 0.25 * widthChildTable,
        height: 0.25 * widthChildTable,
        bottom: '15%',
    }
})