import React, { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import {
    setUser,
} from '../slices/user.slices';
import AuthApi from "../api/auth.api";
import { onGoogleButtonPress } from '../config/google.auth.config';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';

export default function LogIn(props) {

    const dispatch = useDispatch();

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const loginWithGoogle = () => {
        onGoogleButtonPress()
            .then((idToken) => {
                AuthApi.signInWithGoogle(idToken)
                    .then(res => {
                        if (res.data.error) {
                            return Alert.alert("Error", res.data.error);
                        }

                        if (res.data.message === 'no_name') {
                            props.navigation.navigate("SetName", {
                                email: res.data.email,
                            });
                            return;
                        }

                        if (res.data.accessToken && res.data.user && res.data.refreshToken) {
                            AsyncStorage.setItem('user', JSON.stringify(res.data.user));
                            AsyncStorage.setItem('accessToken', res.data.accessToken);
                            AsyncStorage.setItem('refreshToken', res.data.refreshToken);
                            dispatch(setUser(res.data.user));
                            props.navigation.navigate("Home");
                        } else {
                            Alert.alert("Something went wrong... Try later!")
                        }

                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }

    const loginWithFacebook = () => {
        LoginManager.logInWithPermissions(['public_profile', 'email', 'user_friends']).then(
            function (result) {
                if (result.isCancelled) {
                    console.log("Login cancelled");
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            console.log("Token from Facebook: ", data.accessToken.toString());
                            // send the token to server to verify
                        }
                    )
                    LoginManager.logOut();
                }
            },
            function (error) {
                console.log("Login fail with error: " + error);
            }
        );
    }

    return (
        <LinearGradient
            style={{ flex: 1, alignItems: 'center' }}
            colors={['#cc2b5e', '#753a88']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <Text style={styles.headerTitle}>Đăng nhập</Text>
            <View
                style={[styles.loginBar, { marginBottom: 15 }]}
            >
                <EvilIcons name="user" color={'white'} size={40} style={styles.informationIcon} ></EvilIcons>
                <TextInput
                    style={styles.textInput}
                    maxLength={50}
                    placeholder="Nhập gmail hoặc số điện thoại"
                    placeholderTextColor={'rgba(255,255,255,0.6)'}
                    keyboardType="email-address"
                    onChangeText={(email) => setEmail(email)}
                ></TextInput>
            </View>

            <View
                style={styles.loginBar}
            >
                <EvilIcons name="lock" color={'white'} size={40} style={styles.informationIcon}></EvilIcons>
                <TextInput
                    style={styles.textInput}
                    maxLength={50}
                    placeholder="Nhập mật khẩu"
                    placeholderTextColor={'rgba(255,255,255,0.6)'}
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                ></TextInput>
            </View>

            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.forgetButton}
                onPress={() => {

                }}
            >
                <Text style={styles.forgetText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
            <View style={{ width: "100%", height: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>

                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.button}
                    onPress={() => {
                        props.navigation.navigate('LogUp');
                    }}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                        colors={['#56ab2f', '#a8e063']}
                    >
                        <Text style={styles.textButton}>Đăng ký</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.button}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                        colors={['#02aab0', '#00cdac']}
                    >
                        <Text style={styles.textButton}>Tiếp tục</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <Text style={styles.orWord}>hoặc</Text>

            <View style={styles.loginWithSocialNetworkContainer}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={loginWithFacebook}
                >
                    <Image
                        source={require('../assets/img/Icon/facebook_icon.png')}
                        style={styles.socialNetworkIcon}
                    ></Image>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={loginWithGoogle}
                >
                    <Image
                        source={require('../assets/img/Icon/google_icon.png')}
                        style={styles.socialNetworkIcon}
                    ></Image>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        width: '100%',
        marginVertical: 30,
        textAlign: 'center',
    },
    loginBar: {
        width: '50%',
        height: 42,
        backgroundColor: 'rgba(40,40,40,0.02)',
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    informationIcon: {
        borderColor: 'white',
        borderRightWidth: 1
    },
    textInput: {
        marginHorizontal: 10,
        fontSize: 17,
        height: 50,
        width: '80%',
        color: 'cyan'
    },
    forgetButton: {
        height: 30,
        marginVertical: 5,
        paddingHorizontal: 10,
        left: '17%'
    },
    forgetText: {
        color: 'white',
        textDecorationLine: 'underline'
    },
    button: {
        width: '20%',
        height: 40,
        marginHorizontal: 15,
    },
    gradientButton: {
        flex: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
    },
    textButton: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
    },
    orWord: {
        color: 'rgb(200,200,200)',
        textDecorationLine: 'underline',
        marginVertical: 10
    },
    loginWithSocialNetworkContainer: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    socialNetworkIcon: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginHorizontal: 15
    }
})