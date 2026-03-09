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

const SignUpPersonalScreen = ({ navigation, route }) => {
    const [notificationTitle, setNotificationTitle] = useState("Внимание!");
    const [notificationText, setNotificationText] = useState("Сервисное сообщение.");

    const [placeId, setPlaceId] = useState(false);

    const [usernameValue, setUsernameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [phoneValue, setPhoneValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [surnameValue, setSurnameValue] = useState("");

    const [userAgreementChecked, setUserAgreementChecked] = useState(false);

    const [notificationVisible, setNotificationVisible] = useState(false);

    const [signUpLoading, setSignUpLoading] = useState(false);

    const modalPropsNotification = useMemo(() => ({
        animationType: "slide",
        transparent: true,
        visible: notificationVisible,
        onRequestClose: () => setNotificationVisible(false),
    }), [notificationVisible]);

    const singUp = () => {
        if (signUpLoading) {
            return;
        }

        if(!userAgreementChecked){
            showNotificationPopup("Ошибка!", "Вы не приняли пользовательское соглашение.");
            return;
        }

        setSignUpLoading(true);

        let body = {
            "token": route.params.signup_token,
            "place_id": placeId,
            "username": usernameValue,
            "password": passwordValue,
            "phone": phoneValue,
            "name": nameValue,
            "surname": surnameValue
        }

        let xhr = new XMLHttpRequest();
        let adress = encodeURI(appConfig.apiAddress + "signup/finish");
        xhr.open('POST', adress, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(body));
        xhr.onreadystatechange = async function () {
            if (xhr.readyState == 4) {
                console.log(xhr.status);
                console.log(xhr.responseText);
                if (xhr.status == 201) {
                    navigation.navigate("SignIn", {place_id:placeId});
                } else {
                    try {
                        let response = JSON.parse(xhr.responseText);

                        showNotificationPopup("Ошибка!", response.message);
                    } catch {
                        showNotificationPopup("Ошибка!", "Неизвестная ошибка.");
                    }
                }

                setSignUpLoading(false);
            }
        }
    }

    const goBack = () => {
        navigation.navigate("SignUp", {place_id:placeId})
    }

    const getUsernameValue = e => {
        setUsernameValue(e.nativeEvent.text.trim());
    }
    
    const getPasswordValue = e => {
        setPasswordValue(e.nativeEvent.text.trim());
    }
    
    const getPhoneValue = e => {
        setPhoneValue(e.nativeEvent.text.trim());
    }

    const getNameValue = e => {
        setNameValue(e.nativeEvent.text.trim());
    }

    const getSurnameValue = e => {
        setSurnameValue(e.nativeEvent.text.trim());
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
                <Image style={styles.dataIcon} source={require("../assets/images/icon_personal_data.png")} />
                <Text style={styles.dataIconText}>Укажите данные для завершения регистрации</Text>
                
                <ScrollView style={styles.userDataForm}>
                    <View style={styles.userDataFormItem}>
                        <Text style={styles.userDataFormItemTitle}>Имя пользователя:</Text>
                        <TextInput
                            placeholderTextColor="rgba(173, 206, 255, 0.5)"
                            style={styles.userDataFormItemInput}
                            placeholder="username"
                            onChange={event => getUsernameValue(event)}
                        /> 
                    </View>
                    <View style={styles.userDataFormItem}>
                        <Text style={styles.userDataFormItemTitle}>Пароль:</Text>
                        <TextInput
                            placeholderTextColor="rgba(173, 206, 255, 0.5)"
                            style={styles.userDataFormItemInput}
                            secureTextEntry={true}
                            placeholder="password"
                            onChange={event => getPasswordValue(event)}
                        />
                    </View>
                    <View style={styles.userDataFormItem}>
                        <Text style={styles.userDataFormItemTitle}>Телефон:</Text>
                        <TextInput
                            placeholderTextColor="rgba(173, 206, 255, 0.5)"
                            style={styles.userDataFormItemInput}
                            placeholder="+79037916101"
                            onChange={event => getPhoneValue(event)}
                        />
                    </View>
                    <View style={styles.userDataFormItem}>
                        <Text style={styles.userDataFormItemTitle}>Имя:</Text>
                        <TextInput
                            placeholderTextColor="rgba(173, 206, 255, 0.5)"
                            style={styles.userDataFormItemInput}
                            placeholder="Иван"
                            onChange={event => getNameValue(event)}
                        />
                    </View>
                    <View style={styles.userDataFormItem}>
                        <Text style={styles.userDataFormItemTitle}>Фамилия:</Text>
                        <TextInput
                            placeholderTextColor="rgba(173, 206, 255, 0.5)"
                            style={styles.userDataFormItemInput}
                            placeholder="Иванов"
                            onChange={event => getSurnameValue(event)}
                        />
                    </View>
                    <View style={styles.userDataFormItem}>
                        <Text style={styles.userDataFormItemTitle}>Я прочитал и согласен c {"\n"}<Text style={styles.userDataFormItemTitleLnk}>Пользовательским соглашением</Text></Text>
                        <TouchableOpacity style={styles.privacyPolicyCheckbox} onPress={() => setUserAgreementChecked(!userAgreementChecked)}>
                            {userAgreementChecked ? <Image style={styles.privacyPolicyCheckboxIcon} source={require("../assets/images/checkbox_checked.png")} /> : <Image style={styles.privacyPolicyCheckboxIcon} source={require("../assets/images/checkbox_unchecked.png")} />} 
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                 

                <Text style={styles.goBackButton} onPress={goBack}>В начало</Text>

                <TouchableOpacity style={styles.nextStepButton} onPress={singUp}>
                    {signUpLoading ? <ActivityIndicator size="small" color="#fff" style={{marginTop:15}} /> : <Text style={styles.nextStepButtonText}>Продолжить</Text>}
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
    dataIcon:{
        width:160, 
        height:160,
        position:"absolute",
        top:50,
        left:(windowWidth / 2) - 80
    },
    dataIconText:{
        width:windowWidth - 40,
        position:"absolute",
        top:230,
        left:20,
        textAlign:"center",
        color:"#fff",
        fontFamily:"Formular-Medium",
        fontSize:16
    },
    userDataForm:{
        width:"100%",
        height:windowHeight - 295 - 130,
        position:"absolute",
        top:290,
        left:0,
        paddingTop:5
    },
    userDataFormItem:{
        width:"100%",
        height:70,
        marginBottom:15
    },
    userDataFormItemTitle:{
        width: "100%",
        textAlign: "center",
        position: "absolute",
        left: 0,
        top: 0,
        color: "#ffffffAA",
        fontFamily: "Formular-Medium",
        fontSize: 14
    },
    userDataFormItemTitleLnk:{
        width: "100%",
        textAlign: "center",
        position: "absolute",
        left: 0,
        top: 0,
        color: "#fff",
        fontFamily: "Formular-Bold",
        fontSize: 14
    },
    userDataFormItemInput:{
        width: windowWidth - 40,
        height: 40,
        fontFamily: "Formular",
        fontSize: 18,
        backgroundColor: "rgba(0, 0, 0, .4)",
        borderRadius: 12,
        position: "absolute",
        bottom: 0,
        left: 20,
        textAlign: "center",
        color: "#fff",
        overflow:"hidden"
    },
    privacyPolicyCheckbox:{
        width: 26,
        height: 26,
        position: "absolute",
        left: (windowWidth / 2) - 13,
        bottom: 0
    },
    privacyPolicyCheckboxIcon:{
        width: 26,
        height: 26,
        position: "absolute",
        top:0,
        left:0
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

export default SignUpPersonalScreen