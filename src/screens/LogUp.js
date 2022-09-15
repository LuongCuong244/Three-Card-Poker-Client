import React, { Component } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import EvilIcons from 'react-native-vector-icons/EvilIcons'

export default class LogUp extends Component {
    render() {
        return (
            <LinearGradient
                style={{ flex: 1, alignItems: 'center' }}
                colors={['#cc2b5e', '#753a88']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text style={styles.headerTitle}>Đăng ký</Text>
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
                        onChangeText={(email) => this.setState({ email: email })}
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
                        onChangeText={(password) => this.setState({ password: password })}
                    ></TextInput>
                </View>

                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.button}
                    onPress={() => {
                        
                    }}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                        colors={['#02aab0', '#00cdac']}
                    >
                        <Text style={styles.textButton}>Hoàn tất</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <Text style={styles.orWord}>hoặc</Text>

                <View style={styles.loginWithSocialNetworkContainer}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            this.loginWithFacebook();
                        }}
                    >
                        <Image
                            source={require('../assets/img/Icon/facebook_icon.png')}
                            style={styles.socialNetworkIcon}
                        ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            this.loginWithGoogle();
                        }}
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
        width: '40%',
        height: 40,
        marginHorizontal: 15,
        marginTop: 25,
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