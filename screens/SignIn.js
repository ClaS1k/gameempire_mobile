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
import AsyncStorage from '@react-native-async-storage/async-storage';

import appConfig from "../appConfig";

const SignInScreen = ({ navigation, route }) => {
    const [placeId, setPlaceId] = useState("");

    const [userLogin, setUserLogin] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [autoLogin, setAutoLogin] = useState(true);

    const [authLoading, setAuthLoading] = useState(false);
    
    const setAccountData = async (user_id, token, place_id, autologin) => {
        await AsyncStorage.setItem('USER_ID', user_id.toString());
        await AsyncStorage.setItem('TOKEN', token.toString());
        await AsyncStorage.setItem('PLACE_ID', place_id.toString());
        await AsyncStorage.setItem('AUTOLOGIN', autologin ? "1" : "0");
        // AsyncStorage не поддерживает булевы значения
        // поэтому autologin меняем на строку 0 или 1

        return true;
    }

    const getLoginValue = e => {
        setUserLogin(e.nativeEvent.text.trim());
    }

    const getPasswordValue = e => {
        setUserPassword(e.nativeEvent.text.trim());
    }

    const swithAutologStatus = () => {
        setAutoLogin(!autoLogin);
    }

    const auth = () => {
        setAuthLoading(true);

        let body = {
            "username": userLogin,
            "password": userPassword,
            "place_id": placeId
        }

        let xhr = new XMLHttpRequest();
        let adress = encodeURI(appConfig.apiAddress + "auth");
        xhr.open('POST', adress, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(body));
        xhr.onreadystatechange = async function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 202) {
                    let response = JSON.parse(xhr.responseText);

                    await setAccountData(response.user_id, response.token, placeId, autoLogin);

                    navigation.navigate("Home");
                } else {
                    try {
                        let response = JSON.parse(xhr.responseText);

                        Alert.alert(response.message);
                        // setErrorMessage(response.message);
                    } catch {
                        Alert.alert("Неизвестная ошибка");

                        // setErrorMessage("Неизвестная ошибка");
                    }
                }

                setAuthLoading(false);
            }
        }
    }

    const signUp = () => {
        navigation.navigate("SignUp");
    }

    const goSelection = () => {
        navigation.navigate("PlaceSelector");
    }

    const goReviews = () => {
        navigation.navigate("ReviewsUnauth", { place_id: placeId });
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
        
        setPlaceId(route.params.place_id);
    }, []);

    return (
            <View style={styles.background}>
                <StatusBar />
                <Image style={styles.logoImg} source={require("../assets/images/place_logo.png")} />
                <View style={styles.placeControls}>
                <Text style={styles.placeName}>Game Empire 1</Text>

                    <TouchableOpacity style={styles.editPlace} onPress={goSelection}>
                        <Image style={styles.editPlaceImg} source={require("../assets/images/icon_edit.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ratesPlace} onPress={goReviews}>
                        <Image style={styles.ratesPlaceImg} source={require("../assets/images/icon_star.png")} />
                    </TouchableOpacity>
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
                    <Text style={styles.autoLogContainerText}>Входить автоматически</Text>
                    <TouchableOpacity style={styles.autoLogContainerCheckbox} onPress={swithAutologStatus}>
                    {autoLogin ? <Image style={styles.autoLogContainerCheckboxIcon} source={require("../assets/images/checkbox_checked.png")} /> : <Image style={styles.autoLogContainerCheckboxIcon} source={require("../assets/images/checkbox_unchecked.png")} />} 
                    </TouchableOpacity>
                </View>

                {/* <View style={styles.savePassContainer}>
                    <Image style={styles.savePassContainerCheckbox} source={require("../assets/images/checkbox_unchecked.png")} />
                    <Text style={styles.savePassContainerText}>Сохранить пароль</Text>
                </View> */}

                <Text style={styles.createAccountLnk} onPress={signUp}>Создать аккаунт</Text>

                <TouchableOpacity style={styles.signInButton} onPress={auth}>
                    <Text style={styles.signInButtonText}>Войти</Text>
                </TouchableOpacity>
            </View>
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
    autoLogContainerCheckboxIcon: {
        width: 20,
        height: 20,
        position: "absolute",
        top: 0,
        left: 0
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