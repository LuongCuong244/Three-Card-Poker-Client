import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { CircleSnail } from "react-native-progress";
import Toast from "react-native-simple-toast";
import RoomApi from "../../api/room.api";

export default function ShowFindRoom(props) {

    const [roomName, setRoomName] = useState('');
    const [loading, setLoading] = useState(false);

    const onChangeText = (roomName) => {
        if (roomName.length < 20) {
            setRoomName(roomName.replace(/[^A-Z0-9\_]/ig, ''));
        }
    }

    const onExit = () => {
        props.setShowFindRoom(0);
    }

    const findingRoom = () => {
        
        setLoading(true);
        RoomApi.findRoom(roomName)
            .then((res) => {
                if (res.data.error) {
                    Toast.show('Không tìm thấy bàn nào có tên ' + roomName);
                    props.setShowFindRoom(0);
                    console.log(res.data.error);
                } else {
                    Toast.show('Đã tìm thấy bàn có tên ' + roomName);
                    props.setShowFindRoom(0, res.data.room);
                }
            })
            .catch(err => {
                console.log(err);
                Toast.show('Không tìm thấy bàn nào có tên ' + roomName);
                props.setShowFindRoom(0);
            })
            //.finally(() => setLoading(false));   // error: Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    }

    return (
        <LinearGradient
            style={styles.container}
            colors={['#1e9afe', '#60dfcd']}
        >
            <View style={styles.titleContainer}>
                <Text style={styles.title} >TÌM PHÒNG</Text>
            </View>

            <View style={styles.viewContainer} >
                <View style={styles.textInputContainer} >
                    <TextInput
                        style={styles.textInput}
                        placeholder="Nhập tên bàn cần tìm"
                        onChangeText={onChangeText}
                        value={roomName}
                    ></TextInput>
                </View>
            </View>

            {
                loading ? (
                    <View style={styles.buttonContainer} >
                        <CircleSnail color={['red', 'green', 'blue']} size={35} ></CircleSnail>
                    </View>
                ) : (
                    <View style={styles.buttonContainer} >

                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={{ width: 100, height: 30, marginHorizontal: 20 }}
                            onPress={onExit}
                        >
                            <LinearGradient
                                style={styles.backgroundButton}
                                colors={['#ff748b', '#fe7bb0']}
                            >
                                <Text style={styles.buttonText}>Thoát</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={{ width: 100, height: 30, marginHorizontal: 20 }}
                            onPress={findingRoom}
                        >
                            <LinearGradient
                                style={styles.backgroundButton}
                                colors={['#0bab64', '#3bb78f']}
                            >
                                <Text style={styles.buttonText}>Tìm kiếm</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )
            }
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 330,
        height: 200,
        borderRadius: 10,
        borderColor: 'yellow',
        borderWidth: 2,
    },
    titleContainer: {
        width: '100%',
        height: 50,
        backgroundColor: '#114f84',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        color: 'white'
    },
    viewContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInputContainer: {
        width: '90%',
        height: 35,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        fontSize: 18,
        height: 60,
        width: '100%',
        letterSpacing: 1,
        color: 'rgb(50,50,50)',
        textAlign: 'center',
        padding: 0,
    },
    buttonContainer: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundButton: {
        flex: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600'
    },
})