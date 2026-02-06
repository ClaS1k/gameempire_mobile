import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Dimensions,
    Alert
} from 'react-native';

import * as Font from 'expo-font';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import appConfig from "../appConfig";

const SignInScreen = ({ navigation }) => {
    const [userLogin, setUserLogin] = useState("");
    const [userPassword, setUserPassword] = useState("");
    
    const getLoginValue = e => {
        setUserLogin(e.nativeEvent.text.trim());
    }

    const getPasswordValue = e => {
        setUserPassword(e.nativeEvent.text.trim());
    }

    const auth = () => {
        navigation.navigate("Home");
    }

    const signUp = () => {
        navigation.navigate("SignUp");
    }

    const loadFonts = async () => {
        await Font.loadAsync({
            'Formular': require('../assets/fonts/Formular.ttf'),
            'Formular-Bold': require('../assets/fonts/Formular-Bold.ttf'),
            'Formular-Italic': require('../assets/fonts/Formular-Italic.ttf'),
            'Formular-Light': require('../assets/fonts/Formular-Light.ttf'),
            'Formular-Medium': require('../assets/fonts/Formular-Medium.ttf'),
    
        });
    };
    
    useEffect(() => {
        loadFonts();
    }, []);

    return (
        <SafeAreaView style={{ backgroundColor: '#1E1E1E' }}>
            <StatusBar />
            <View style={styles.background}>
                <Image style={styles.logoImg} source={require("../assets/images/place_logo.png")} />
                <View style={styles.placeControls}>
                    <TouchableOpacity style={styles.editPlace}>
                        <Image style={styles.editPlaceImg} source={require("../assets/images/icon_edit.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ratesPlace}>
                        <Image style={styles.ratesPlaceImg} source={require("../assets/images/icon_star_alt.png")} />
                    </TouchableOpacity>
                    <Text style={styles.placeName}>Game Empire 1</Text>
                </View>

                <Text style={styles.usernameTitle}>Логин:</Text>
                <TextInput
                    placeholderTextColor="rgba(173, 206, 255, 0.5)"
                    style={styles.usernameInput}
                    placeholder="Username"
                    onChange={event => getLoginValue(event)}
                />

                <Text style={styles.passwordTitle}>Пароль:</Text>
                <TextInput
                    placeholderTextColor="rgba(173, 206, 255, 0.5)"
                    style={styles.passwordInput}
                    secureTextEntry={true}
                    placeholder="Password"
                    onChange={event => getPasswordValue(event)}
                />

                <View style={styles.autoLogContainer}>
                    <Image style={styles.autoLogContainerCheckbox} source={require("../assets/images/checkbox_checked.png")} /> 
                    <Text style={styles.autoLogContainerText}>Входить автоматически</Text>
                </View>

                <View style={styles.savePassContainer}>
                    <Image style={styles.savePassContainerCheckbox} source={require("../assets/images/checkbox_unchecked.png")} />
                    <Text style={styles.savePassContainerText}>Сохранить пароль</Text>
                </View>

                <Text style={styles.createAccountLnk} onPress={signUp}>Создать аккаунт</Text>

                <TouchableOpacity style={styles.signInButton} onPress={auth}>
                    <Text style={styles.signInButtonText}>Войти</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1E1E1E'
    },
    logoImg:{
        width:176,
        height:176,
        position:"absolute",
        top:65,
        left: (windowWidth - 176) / 2,
        objectFit:"contain"
    },
    placeControls:{
        width:"100%",
        height:26,
        position:"absolute",
        top:270,
        left:0
    },
    editPlace:{
        width:18,
        height:18,
        position: "absolute",
        top: 1,
        left: (windowWidth / 2) - 88,
    },
    editPlaceImg:{
        width:18,
        height:18
    },
    placeName:{
        width:"100%",
        fontFamily:"Formular-Medium",
        fontSize:16,
        textAlign:"center",
        color:"#fff",
        position:"absolute",
        top:0,
        left:0
    },
    ratesPlace:{
        position:"absolute",
        top:1,
        left:(windowWidth / 2) + 70,
        width:18,
        height:18
    },
    ratesPlaceImg:{
        width:18,
        height:18
    },
    usernameTitle:{
        width:"100%",
        fontFamily: 'Formular-Medium',
        fontSize: 13,
        position: "absolute",
        top: 360,
        left: 0,
        color: "#fff",
        textAlign: "center"
    },
    usernameInput:{
        width:windowWidth - 50,
        height:40,
        fontFamily:"Formular",
        fontSize:18,
        backgroundColor:"rgba(0, 0, 0, .4)",
        borderRadius:12,
        position:"absolute",
        top:386,
        left:25,
        textAlign:"center",
        color:"#fff"
    },
    passwordTitle:{
        width: "100%",
        fontFamily: 'Formular-Medium',
        fontSize: 13,
        position: "absolute",
        top: 444,
        left: 0,
        color: "#fff",
        textAlign: "center"
    },
    passwordInput:{
        width: windowWidth - 50,
        height: 40,
        fontFamily: "Formular",
        fontSize: 18,
        backgroundColor: "rgba(0, 0, 0, .4)",
        borderRadius: 12,
        position: "absolute",
        top: 470,
        left: 25,
        textAlign: "center",
        color: "#fff"
    },
    autoLogContainer:{
        width:"100%",
        height:20,
        position:"absolute",
        top:530,
        left:0
    },
    autoLogContainerCheckbox:{
        width:20,
        height:20,
        position:"absolute",
        top:0,
        left:(windowWidth / 2) - 10 - 90
    },
    autoLogContainerText:{
        fontFamily: "Formular",
        fontSize: 14,
        color: "rgba(255,255,255, .8)",
        width:"100%",
        textAlign:"center",
        position:"absolute",
        top:1,
        left:10
    },
    savePassContainer:{
        width: "100%",
        height: 20,
        position: "absolute",
        top: 562,
        left: 0
    },
    savePassContainerCheckbox:{
        width: 20,
        height: 20,
        position: "absolute",
        top: 0,
        left: (windowWidth / 2) - 10 - 70
    },
    savePassContainerText:{
        fontFamily: "Formular",
        fontSize: 14,
        color: "rgba(255,255,255, .8)",
        width: "100%",
        textAlign: "center",
        position: "absolute",
        top: 1,
        left: 10
    },
    createAccountLnk:{
        fontFamily: "Formular",
        fontSize: 14,
        color: "rgba(255,255,255, .8)",
        width:200,
        textAlign:"center",
        position:"absolute",
        bottom:95,
        left:(windowWidth / 2) - 100
    },
    signInButton: {
        width: windowWidth - 50,
        height: 50,
        backgroundColor: "#A915FF",
        borderRadius: 12,
        position: "absolute",
        bottom: 25,
        left: 25
    },
    signInButtonText:{
        width:"100%",
        fontFamily: 'Formular-Bold',
        fontSize: 18,
        position: "absolute",
        top: 14,
        left: 0,
        color: "#fff",
        textAlign: "center"
    }
});

export default SignInScreen