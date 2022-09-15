import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { CircleSnail } from "react-native-progress";
import formatCoin from "../../modules/FormatCoin";
import formatCoinByLetter from "../../modules/FormatCoinByLetter";
import socketController from '../../socketIO/socket.controller';
import { useSelector } from 'react-redux';
import {
    selectUser,
} from '../../slices/user.slices';
import RoomApi from "../../api/room.api";
import FormatCoin from "../../modules/FormatCoin";
import { selectRoom } from "../../slices/room.slices";

export default function ShowChangeBet(props) {

    const user = useSelector(selectUser);
    const room = useSelector(selectRoom);

    const [minBet, setMinBet] = useState(props.minBet);
    const [newBet, setNewBet] = useState(props.newBet || '');
    const [isLoading, setLoading] = useState(false);

    const onConfirmNewBet = async () => {

        if (!newBet) {
            return props.onHideChangeBet("Vẫn giữ nguyên mức cược");
        }

        let newBetToInt = parseInt(newBet);

        if (newBetToInt < minBet) {
            return props.onHideChangeBet("Thất bại! Mức cược nhỏ hơn mức tối thiểu");
        }

        if (newBetToInt > user.coin) {
            return props.onHideChangeBet('Thất bại! Bạn không đủ ' + `${formatCoinByLetter(newBetToInt)}` + ' để cược.');
        }

        setLoading(true);
        await RoomApi.changeBet({
            roomName: room.roomName,
            userName: user.userName,
            newBet: newBetToInt
        })
            .then((res) => {
                if (res.data.error) {
                    props.onHideChangeBet(res.data.error);
                } else {
                    if (res.data.updateBet === 'Yes') {
                        console.log(room.playerKey);
                        socketController.updateChangeBet(room.roomName, room.playerKey);
                    }
                    props.onHideChangeBet('Thành công! Mức cược sẽ được áp dụng từ ván sau.');
                }
            })
            .catch(err => {
                console.log(err);
                props.onHideChangeBet('Đã có lỗi xảy ra!');
            })
            .finally(() => setLoading(false));
    }

    const betAllOfCoin = () => {
        setNewBet(user.coin);
    }

    const onChangeTextNewBet = (newBet) => {
        setNewBet(newBet.replace(/[^0-9]/ig, ''));
    }

    return (
        <LinearGradient
            style={styles.container}
            colors={['#5e5c5c', '#9dc5c3']}
        >
            <LinearGradient
                style={styles.titleContainer}
                colors={['#5e5c5c', '#9dc5c3']}
            >
                <Text style={styles.title}>Đặt lại mức cược</Text>
            </LinearGradient>

            <Text style={styles.fieldName} >Mức cược tối thiểu của phòng</Text>
            <Text style={styles.minBet} >{formatCoin(minBet)}</Text>
            <View style={{ width: '70%', height: 1, backgroundColor: 'white' }} ></View>
            <View style={styles.inputContainer}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={betAllOfCoin}
                >
                    <LinearGradient
                        style={styles.allInButton}
                        colors={['#eb4511', '#b02e0c']}
                    >
                        <Text style={styles.buttonText}>Đặt tất</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <View style={styles.textInputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Nhập mức cược !"
                        keyboardType="numeric"
                        onChangeText={onChangeTextNewBet}
                        value={FormatCoin(newBet)}
                    />
                </View>
            </View>
            {
                isLoading ? (
                    <CircleSnail size={28} color={['red', 'green', 'blue']} ></CircleSnail>
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={onConfirmNewBet}
                    >
                        <LinearGradient
                            style={styles.confirmButton}
                            colors={['#e48d2f', '#c18646']}
                        >
                            <Text style={styles.confirmText}>Xác nhận</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )
            }
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 290,
        height: 190,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
    },
    titleContainer: {
        width: '100%',
        height: 35,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        letterSpacing: 1,
        fontWeight: 'bold',
        fontSize: 17,
        marginVertical: 5,
        color: '#380036',
    },
    fieldName: {
        fontSize: 12,
        fontStyle: 'italic',
        fontWeight: '600',
        color: 'black',
        marginTop: 10
    },
    minBet: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'cyan',
        marginTop: 5
    },
    inputContainer: {
        height: 60,
        width: '100%',
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    allInButton: {
        width: 65,
        height: 25,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 13,
        letterSpacing: 0.3,
        fontWeight: '700',
        color: 'white'
    },
    textInputContainer: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'white',
        width: 185,
        height: 35,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: 50,
        width: 185,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        color: '#ffd700',
        letterSpacing: 1,
    },
    confirmButton: {
        width: 110,
        height: 25,
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30
    },
    confirmText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
    }
})