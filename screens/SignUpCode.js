import React, { useState, useEffect, useMemo } from 'react';
import {
    Text,
    View,
    ScrollView,
    StatusBar,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Dimensions,
    Alert,
    Modal
} from 'react-native';

import * as Font from 'expo-font';

import appConfig from "../appConfig";

const SignUpCodeScreen = ({ navigation, route }) => {
    const [notificationTitle, setNotificationTitle] = useState("Внимание!");
    const [notificationText, setNotificationText] = useState("Сервисное сообщение.");

    const [placeId, setPlaceId] = useState(false);

    const [codeValue, setCodeValue] = useState("");

    const [notificationVisible, setNotificationVisible] = useState(false);

    const [checkCodeLoading, setCheckCodeLoading] = useState(false);

    const modalPropsNotification = useMemo(() => ({
        animationType: "slide",
        transparent: true,
        visible: notificationVisible,
        onRequestClose: () => setNotificationVisible(false),
    }), [notificationVisible]);

    const goBack = () => {
        navigation.navigate("SignUp", {place_id:placeId})
    }

    const checkCode = () => {
        if (checkCodeLoading) {
            return;
        }

        setCheckCodeLoading(true);

        let body = {
            "code": codeValue,
            "place_id": placeId
        }

        let xhr = new XMLHttpRequest();
        let adress = encodeURI(appConfig.apiAddress + "signup/validate");
        xhr.open('POST', adress, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(body));
        xhr.onreadystatechange = async function () {
            if (xhr.readyState == 4) { 
                if (xhr.status == 200) {
                    let response = JSON.parse(xhr.responseText);

                    navigation.navigate("SignUpPersonal", { place_id: placeId, signup_token: response.data })
                } else {
                    try {
                        let response = JSON.parse(xhr.responseText);

                        showNotificationPopup("Ошибка!", response.message);
                    } catch {
                        showNotificationPopup("Ошибка!", "Неизвестная ошибка.");
                    }
                }

                setCheckCodeLoading(false);
            }
        }
    }

    const getCodeValue = e => {
        setCodeValue(e.nativeEvent.text.trim());
    }

    const showNotificationPopup = (title, text) => {
        setNotificationTitle(title);
        setNotificationText(text);

        setNotificationVisible(true);
    }

    const NotificationPopup = () => {
        let touchY;

        return (
            <Modal {...modalPropsNotification}>
                <View style={styles.popupView}
                    onTouchStart={e => touchY = e.nativeEvent.pageY}
                    onTouchEnd={e => {
                        if (touchY - e.nativeEvent.pageY < -50) {
                            setNotificationVisible(false);
                        }
                    }}>
                    <Text style={styles.notificationTitle}>{notificationTitle}</Text>
                    <Text style={styles.notificationText}>{notificationText}</Text>

                    <TouchableOpacity style={styles.popupViewCloseButton} onPress={() => setNotificationVisible(!notificationVisible)}>
                        <Text style={styles.popupViewCloseButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    useEffect(() => {
        setPlaceId(route.params.place_id);
    }, []);

    return (
        <View style={{ backgroundColor: '#1E1E1E' }}>
            <StatusBar />
            <View style={styles.background}>
                <Image style={styles.codeIcon} source={require("../assets/images/icon_code.png")} />
                <Text style={styles.codeIconText}>Введите код, отправленный на адрес {route.params.email}</Text>

                <Text style={styles.codeInputTitle}>Код подтверждения</Text>
                <TextInput
                    placeholderTextColor="rgba(173, 206, 255, 0.5)"
                    style={styles.codeInput}
                    placeholder="4512"
                    onChange={event => getCodeValue(event)}
                /> 

                <Text style={styles.goBackButton} onPress={goBack}>Вернуться</Text>

                <TouchableOpacity style={styles.nextStepButton} onPress={checkCode}>
                    {checkCodeLoading ? <ActivityIndicator size="small" color="#fff" style={{marginTop:15}} /> : <Text style={styles.nextStepButtonText}>Продолжить</Text>}
                </TouchableOpacity>

                <NotificationPopup />
            </View>
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
    codeIcon:{
        width:160, 
        height:160,
        position:"absolute",
        top:50,
        left:(windowWidth / 2) - 80
    },
    codeIconText:{
        width:windowWidth - 40,
        position:"absolute",
        top:230,
        left:20,
        textAlign:"center",
        color:"#fff",
        fontFamily:"Formular-Medium",
        fontSize:16
    },
    codeInputTitle:{
        width:"100%",
        textAlign:"center",
        position:"absolute",
        left:0,
        top:(windowHeight / 2) - 40,
        color:"#fff",
        fontFamily:"Formular-Medium",
        fontSize:14
    },
    codeInput:{
        width: windowWidth - 40,
        height: 40,
        fontFamily: "Formular",
        fontSize: 18,
        backgroundColor: "rgba(0, 0, 0, .4)",
        borderRadius: 12,
        position: "absolute",
        top: (windowHeight / 2) - 10,
        left: 20,
        textAlign: "center",
        color: "#fff"
    },
    goBackButton:{
        fontFamily: "Formular",
        fontSize: 14,
        color: "rgba(255,255,255, .8)",
        width: 200,
        textAlign: "center",
        position: "absolute",
        bottom: 95,
        left: (windowWidth / 2) - 100
    },
    nextStepButton:{
        width: windowWidth - 40,
        height: 50,
        backgroundColor: "#A915FF",
        borderRadius: 12,
        position: "absolute",
        bottom: 25,
        left: 20
    },
    nextStepButtonText:{
        width: "100%",
        fontFamily: 'Formular-Bold',
        fontSize: 18,
        position: "absolute",
        top: 14,
        left: 0,
        color: "#fff",
        textAlign: "center"
    },
    popupView: {
        width: "100%",
        height: windowHeight - 200,
        position: "absolute",
        bottom: 0,
        left: 0,
        backgroundColor: "#2C2C2C",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12
    },
    popupViewTitle: {
        width: "100%",
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 20,
        color: "#fff",
        position: "absolute",
        top: 20,
        left: 0
    },
    popupViewCloseButton: {
        width: windowWidth - 40,
        height: 50,
        position: "absolute",
        bottom: 25,
        left: 20,
        borderRadius: 12,
        backgroundColor: "#A915FF"
    },
    popupViewCloseButtonText: {
        width: "100%",
        textAlign: "center",
        color: "#fff",
        fontFamily: "Formular-Bold",
        position: 'absolute',
        left: 0,
        top: 15
    },
    notificationTitle: {
        width: "100%",
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 18,
        position: "absolute",
        top: 10,
        left: 0,
        color: "#fff"
    },
    notificationText: {
        width: windowWidth - 40,
        height: windowHeight - 360,
        textAlign: "center",
        color: "#fff",
        fontFamily: "Formular",
        position: "absolute",
        left: 20,
        top: 60
    }
});

export default SignUpCodeScreen