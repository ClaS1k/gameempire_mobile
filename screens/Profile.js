import React, { useState, useEffect } from 'react';
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
    Alert
} from 'react-native';

import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

import appConfig from "../appConfig";

const ProfileScreen = ({ navigation }) => {
    const [userToken, setUserToken] = useState(false);
    // false - токен еще не загружен или его нет

    const [profileData, setProfileData] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);

    const clearDb = async () => {
        await AsyncStorage.clear();
    }

    const logOut = () => {
        clearDb();
        navigation.navigate("PlaceSelector");
    }

    const getProfile = () => {
        setProfileLoading(true);

        fetch(appConfig.apiAddress + "profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + userToken.trim()
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);

                        setProfileLoading(false);
                    } catch {
                        setProfileLoading(false);
                    }
                });
            } else {
                return res.text().then(text => {
                    let user_data = JSON.parse(text);
                    user_data = user_data.data;

                    setProfileData(user_data);

                    setProfileLoading(false);
                });
            }
        });
    }

    const TopProfile = () => {
        let profileDataAvailable = !(profileData === false || profileData === null || profileData === undefined || profileLoading)

        return(
            <View style={styles.profileContainer}>
                <Image style={styles.profileTopIcon} source={require("../assets/images/icon_profile_big.png")} />
                <Text style={styles.profileTopUsername}>{profileDataAvailable ? profileData.username : "-"}</Text>
                <Text style={styles.profileTopPhone}>{(profileDataAvailable && (profileData.gizmo_data.phone != null)) ? profileData.gizmo_data.phone : "-"}</Text>
            </View>
        );
    }

    const ProfileAditional = () => {
        let profileDataAvailable = !(profileData === false || profileData === null || profileData === undefined || profileLoading)

        let user_email;
        let user_name;
        let user_surname;
        let user_birthdate;
        let user_app_id;
        let user_service_id;

        if (profileDataAvailable){
            user_email = profileData.gizmo_data.email == false ? "Не указано" : profileData.gizmo_data.email;
            user_name = profileData.gizmo_data.firstName == false ? "Не указано" : profileData.gizmo_data.firstName;
            user_surname = profileData.gizmo_data.lastName == false ? "Не указано" : profileData.gizmo_data.lastName;
            user_birthdate = profileData.gizmo_data.birthDate == false ? "Не указано" : profileData.gizmo_data.birthDate;
            user_app_id = profileData.id;
            user_service_id = profileData.gizmo_id;

            if(user_birthdate != "Не указано"){
                user_birthdate = user_birthdate.split("T");
                user_birthdate = user_birthdate[0].split("-");

                user_birthdate = `${user_birthdate[2]}.${user_birthdate[1]}.${user_birthdate[0]}`;
            }
        }else{
            user_email = `Загрузка...`;
            user_name = `Загрузка...`;
            user_surname = `Загрузка...`;
            user_birthdate = `Загрузка...`;
            user_app_id = `-`;
            user_service_id = `-`;
        } 

        return( 
            <View style={styles.profileAditionalContainer}>
                <View style={styles.profileAditionalItem}>
                    <Text style={styles.profileAditionalItemName}>Email</Text>
                    <Text style={styles.profileAditionalItemValue}>{user_email}</Text>
                </View>
                <View style={styles.profileAditionalItem}>
                    <Text style={styles.profileAditionalItemName}>Имя</Text>
                    <Text style={styles.profileAditionalItemValue}>{user_name}</Text>
                </View>
                <View style={styles.profileAditionalItem}>
                    <Text style={styles.profileAditionalItemName}>Фамилия</Text>
                    <Text style={styles.profileAditionalItemValue}>{user_surname}</Text>
                </View>
                <View style={styles.profileAditionalItem}>
                    <Text style={styles.profileAditionalItemName}>Дата рождения</Text>
                    <Text style={styles.profileAditionalItemValue}>{user_birthdate}</Text>
                </View>
                <View style={styles.profileAditionalItem}>
                    <Text style={styles.profileAditionalItemName}>APP ID</Text>
                    <Text style={styles.profileAditionalItemValue}>{user_app_id}</Text>
                </View>
                <View style={styles.profileAditionalItem}>
                    <Text style={styles.profileAditionalItemName}>SERVICE ID</Text>
                    <Text style={styles.profileAditionalItemValue}>{user_service_id}</Text>
                </View>
            </View>
        );
    }

    const LogoutButton = () => {
        return (<TouchableOpacity onPress={logOut} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
        </TouchableOpacity>);
    }

    const Navigation = () => {
        const goNews = () => {
            navigation.navigate("News");
        }

        const goSettings = () => {
            navigation.navigate("Settings");
        }

        const goProfile = () => {
            navigation.navigate("Profile");
        }

        const goQr = () => {
            navigation.navigate("Qr");
        }

        const goHome = () => {
            navigation.navigate("Home");
        }

        return (
            <View style={navigation_styles.navigationBar}>
                <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goNews}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_news.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goSettings}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_settings.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goHome}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_home.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goProfile}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_profile_highlighted.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goQr}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_qr.png")} />
                </TouchableOpacity>
            </View>
        );
    }

    useEffect(() => {
        AsyncStorage.getItem("TOKEN").then((value) => { 
            if (value !== null) {
                setUserToken(value);
            } else {
                navigation.navigate("PlaceSelector");
            }
        });
    }, []);

    useEffect(() => {
        if(userToken !== false && userToken !== null){
            getProfile();
        }
    }, [userToken]);

    return (
        <View style={{ backgroundColor: '#1E1E1E' }}>
            <StatusBar />
            <View style={styles.background}>
                <TopProfile />

                <ProfileAditional />
                <LogoutButton />

                <Navigation />
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
    profileContainer: {
        width: "100%",
        height: 290,
        position: "absolute",
        top: 0,
        left: 0
    },
    profileTopIcon: {
        width: 160,
        height: 160,
        position: "absolute",
        top: 45,
        left: (windowWidth / 2) - 80
    },
    profileTopUsername: {
        width: "100%",
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 16,
        color: "#fff",
        position: "absolute",
        top: 225,
        left: 0
    },
    profileTopPhone: {
        width: "100%",
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 14,
        color: "rgba(255, 255, 255, .6)",
        position: "absolute",
        top: 255,
        left: 0
    },
    profileAditionalContainer:{
        width:windowWidth - 40,
        height:145,
        position:"absolute",
        top:300,
        left:20,
        backgroundColor:"#2C2C2C",
        borderRadius:12
    },
    profileAditionalItem:{
        width: windowWidth - 60,
        height:12,
        marginLeft:10,
        marginTop:10
    },
    profileAditionalItemName:{
        width: "100%",
        textAlign: "left",
        fontFamily: "Formular-Medium",
        fontSize: 12,
        color: "#fff",
        position: "absolute",
        top: 0,
        left: 0
    },
    profileAditionalItemValue:{
        width: "100%",
        textAlign: "right",
        fontFamily: "Formular",
        fontSize: 12,
        color: "#fff",
        position: "absolute",
        top: 0,
        right: 0
    },
    logoutButton:{
        width: windowWidth - 40,
        height: 42,
        position: "absolute",
        top: 465,
        left: 20,
        borderRadius: 12,
        backgroundColor: "#2C2C2C"
    },
    logoutButtonText:{
        width: "100%",
        fontFamily: "Formular-Bold",
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
        position: 'absolute',
        top: 10,
        left: 0
    },
});

const navigation_styles = StyleSheet.create({
    navigationBar: {
        width: windowWidth - 50,
        height: 50,
        backgroundColor: "#2C2C2C",
        borderRadius: 12,
        position: "absolute",
        bottom: 25,
        left: 25,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    navigationBarButton: {
        width: 34,
        height: 34,
        display: "flex",
        flexDirection: "row",
        marginTop: 8
    },
    navigationBarButtonIcon: {
        width: 34,
        height: 34
    }
});

export default ProfileScreen