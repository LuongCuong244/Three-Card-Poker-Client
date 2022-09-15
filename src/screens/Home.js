import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image, Alert, BackHandler } from "react-native";
import formatCoin from "../modules/FormatCoin";
import formatCoinByLetter from "../modules/FormatCoinByLetter";
import { useSelector } from 'react-redux';
import {
    selectUser,
} from '../slices/user.slices';
import AvatarAndUserName from "../components/Home/AvatarAndUserName";

export default function Home(props) {

    const user = useSelector(selectUser);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            Alert.alert("Cảnh báo", "Bạn chắc chắn muốn đóng ứng dụng?", [
                {
                    text: "Không",
                    onPress: () => null,
                    style: "cancel"
                },
                {
                    text: "Có", onPress: () => {
                        BackHandler.exitApp();
                    }
                }
            ]);
            return true;
        });

        return () => {
            backHandler.remove();
        }
    },[]);

    return (
        <ImageBackground
            style={{ flex: 1 }}
            source={require('../assets/img/Background/City.jpg')}
        >
            {user?.userName != null &&
                <View style={styles.container}>
                    <View style={{ width: '100%', flexDirection: 'row-reverse' }}>
                        <View style={{ alignItems: 'flex-end', marginTop: 10, marginHorizontal: 10 }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                            >
                                <ImageBackground
                                    style={styles.backgroundCoin}
                                    source={require('../assets/img/Container/ContainerCoin.png')}
                                >
                                    <Text style={styles.textCoin} >{user.coin < 1000000000 ? formatCoin(user.coin) : formatCoinByLetter(user.coin)}</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.7}
                            >
                                <ImageBackground
                                    style={styles.backgroundDiamond}
                                    source={require('../assets/img/Container/ContainerDiamond.png')}
                                >
                                    <Text style={styles.textDiamond} >{user.diamond}</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>

                        <AvatarAndUserName />
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ height: '100%', width: 70, }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    //props.navigation.navigate('Achievements');
                                    Alert.alert("Chưa viết tính năng này!");
                                }}
                            >
                                <Image
                                    source={require('../assets/img/Icon/Cup.png')}
                                    style={{ width: 45, height: 45, marginTop: 20, marginHorizontal: 10 }}
                                ></Image>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    //props.navigation.navigate('Shop');
                                    Alert.alert("Chưa viết tính năng này!");
                                }}
                            >
                                <Image
                                    source={require('../assets/img/Icon/Shop.png')}
                                    style={{ width: 45, height: 45, marginTop: 10, marginHorizontal: 10 }}
                                ></Image>
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    props.navigation.navigate('AllRooms', {
                                        userName: user.userName,
                                    })
                                }}
                            >
                                <Image
                                    source={require('../assets/img/Icon/PlayGame.png')}
                                    style={{ width: 120, height: 120, marginTop: 10, marginHorizontal: 20 }}
                                ></Image>
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: '100%', width: 70, alignItems: 'center' }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    props.navigation.navigate('LeaderBoards', {
                                        userName: user.userName
                                    });
                                }}
                            >
                                <Image
                                    source={require('../assets/img/Icon/TopPlayers.png')}
                                    style={{ width: 117 / 113 * 45, height: 45, marginTop: 10 }}
                                ></Image>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* <View style={{ height: 60, width: '100%', flexDirection: 'row' }} >
                            <TouchableOpacity
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={require('../assets/img/Icon/Settings.png')}
                                    style={{ width: 55, height: 55, marginLeft: 10 }}
                                ></Image>
                            </TouchableOpacity>
                        </View> */}
                </View>
            }
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundCoin: {
        width: 1300 * 40 / 300,
        height: 40,
        justifyContent: 'center'
    },
    textCoin: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffd700',
        marginLeft: '25%',
        top: '5%'
    },
    backgroundDiamond: {
        width: 1079 * 40 / 309,
        height: 40,
        marginTop: 5,
        justifyContent: 'center'
    },
    textDiamond: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#f275fd',
        marginLeft: '33%',
        bottom: '2%',
        textShadowColor: 'purple',
        textShadowRadius: 4,
    },
})