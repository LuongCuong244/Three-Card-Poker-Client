import React, { useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, ImageBackground, Image, Text } from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
import ImgToBase64 from 'react-native-image-base64';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectUser, setAvatar
} from '../../slices/user.slices';
import userApi from "../../api/user.api";

export default function AvatarAndUserName(props) {

    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const [heightAvatar, setHeightAvatar] = useState(50);

    function onLayout(even) {
        setHeightAvatar(even.nativeEvent.layout.height * 0.57)
    }

    function onChangeAvatar() {
        ImagePicker.openPicker({
            cropping: true,
            width: 200,
            height: 200,
            multiple: false,
        })
            .then(async (image) => {
                ImgToBase64.getBase64String(image.path)
                    .then(base64String => {
                        const newAvatar = 'data:image/png;base64,' + base64String
                        userApi.changeAvatar(newAvatar)
                            .then((res) => {
                                if(res.data.status === 200){
                                    dispatch(setAvatar(newAvatar));
                                }
                            })
                            .catch((err) => console.log(err));
                    })
            })
            .catch(err => console.log(err));
    }

    function onPressAvatar() {
        Alert.alert('', "Bạn có muốn thay đổi ảnh đại diện không!", [
            {
                text: 'Không',
                style: 'cancel',
            },
            {
                text: 'Có',
                onPress: onChangeAvatar
            }
        ])
    }

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground
                style={styles.background}
                source={require('../../assets/img/Container/ContainerAvatar.png')}
                onLayout={onLayout}
            >
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onPressAvatar}
                >
                    <Image
                        source={{ uri: user.avatar }}
                        style={{
                            width: heightAvatar,
                            height: heightAvatar,
                            top: '58%',
                            left: '5%'
                        }}
                    ></Image>
                </TouchableOpacity>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{user.userName}</Text>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        width: 873 * 100 / 321,
        height: 100,
        marginLeft: 20,
    },
    nameContainer: {
        width: '55%',
        height: '25%',
        bottom: '8%',
        left: '40.5%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
    }
})