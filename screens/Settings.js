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

const SettingsScreen = ({ navigation }) => {
    const [userToken, setUserToken] = useState(false);
    // false - токен еще не загружен или его нет

    const [userData, setUserData] = useState(false);

    const [profileLoading, setProfileLoading] = useState(false);

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

                    setUserData(user_data);

                    setProfileLoading(false);
                });
            }
        });
    }

    const goPrivacyPolicy = () => {
        if (userData === false || userData === null || userData === undefined || profileLoading){
            return;
        }

        navigation.navigate("DocsViewerAuth", { place_id: userData.place.id, doc_id:0});
    }

    const goRules = () => {
        if (userData === false || userData === null || userData === undefined || profileLoading) {
            return;
        }

        navigation.navigate("DocsViewerAuth", { place_id: userData.place.id, doc_id: 1 });
    }

    const SettingsList = () => {
        return(
            <ScrollView style={styles.settingsListContainer}>
                <TouchableOpacity style={styles.settingsButton} onPress={goPrivacyPolicy}>
                    <Image style={styles.settingsButtonIcon} source={require("../assets/images/icon_privacy_policy.png")} />
                    <Text style={styles.settingsButtonText}>Политика конфиденциальности</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsButton} onPress={goRules}>
                    <Image style={styles.settingsButtonIcon} source={require("../assets/images/icon_rules.png")} />
                    <Text style={styles.settingsButtonText}>Правила посещения</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.settingsButton}>
                    <Image style={styles.settingsButtonIcon} source={require("../assets/images/icon_notifications_enabled.png")} />
                    <Text style={styles.settingsButtonText}>Уведомления включены</Text>
                </TouchableOpacity> */}
            </ScrollView>
        );    
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
                      <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_settings_highlighted.png")} />
                  </TouchableOpacity>
                  <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goHome}>
                      <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_home.png")} />
                  </TouchableOpacity>
                  <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goProfile}>
                      <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_profile.png")} />
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
        if (userToken !== false && userToken !== null) {
            getProfile();
        }
    }, [userToken]);

    return (
        <View style={styles.background}>
            <StatusBar />

            <SettingsList />

            <Navigation />
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
    settingsListContainer:{
        width:"100%",
        height:windowHeight - 90,
        position:"absolute",
        top:0,
        left:0,
        paddingTop:50
    },
    settingsButton:{
        width:windowWidth - 40,
        height:50,
        borderRadius:12,
        backgroundColor:"#2C2C2C",
        marginBottom:20,
        marginLeft:20
    },
    settingsButtonIcon:{
        width:36,
        height:36,
        position:"absolute",
        top:7,
        left:10,
        objectFit:"contain"
    },
    settingsButtonText:{
        width:"100%",
        textAlign:"center",
        color:"#fff",
        fontFamily:"Formular-Bold",
        fontSize:12,
        position:"absolute",
        top:16,
        left:0
    },
});

const navigation_styles = StyleSheet.create({
    navigationBar: {
        width: windowWidth - 40,
        height: 50,
        backgroundColor: "#2C2C2C",
        borderRadius: 12,
        position: "absolute",
        bottom: 25,
        left: 20,
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

export default SettingsScreen