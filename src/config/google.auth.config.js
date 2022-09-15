import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
    webClientId: '15255751602-svs4ft3d6965q37hui0rasggiiq22q1d.apps.googleusercontent.com',
    offlineAccess: true,
});

export async function onGoogleButtonPress() {
    const { idToken } = await GoogleSignin.signIn();
    return idToken;
}

export default GoogleSignin;