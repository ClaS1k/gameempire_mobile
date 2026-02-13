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

const QrScreen = ({ navigation }) => {
    const PermissionsTab = () => {
        return(
            <View style={styles.permissionsTab}>
                <Image style={styles.permissionsTabIcon} source={require("../assets/images/icon_camera_permissions.png")} />
                <Text style={styles.permissionsTabText}>Приложению нужен доступ к камере устройства</Text>
                <TouchableOpacity style={styles.permissionsTabButton}>
                    <Text style={styles.permissionsTabButtonText}>Разрешить</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const ScanTab = () => {
        return (
            <View style={styles.scanTab}>
             
            </View>
        );
    }

    const MyQrTab = () => {
        return (
            <View style={styles.myQrTab}>
                <Image style={styles.myQrImage} source={require("../assets/images/temp_qr.png")} />
                <Text style={styles.myQrTabText}>Покажите QR-код администратору</Text>
            </View>
        );
    }

    const TabSelector = () => {
        return (
            <View style={styles.tabSelector}>
                <TouchableOpacity style={styles.tabSelectorScan}>
                    <Text style={styles.tabSelectorBtnText}>Сканирование</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabSelectorMyQr}>
                    <Text style={styles.tabSelectorBtnText}>Мой QR</Text>
                </TouchableOpacity>
            </View>
        );
    }
        
    const Navigation = () => {
        return (
            <View style={navigation_styles.navigationBar}>
                <TouchableOpacity style={navigation_styles.navigationBarButton}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_news.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={navigation_styles.navigationBarButton}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_settings.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={navigation_styles.navigationBarButton}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_home.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={navigation_styles.navigationBarButton}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_profile.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={navigation_styles.navigationBarButton}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_qr_highlighted.png")} />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.background}>
            <StatusBar />

            {/* <MyQrTab /> */}
            <PermissionsTab />

            <TabSelector />
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
    permissionsTab:{
        width:"100%",
        height:windowHeight - 150,
        position:"absolute",
        top:0,
        left:0
    },
    permissionsTabIcon:{
        width: 160,
        height: 160,
        position:"absolute",
        top:70,
        left:(windowWidth / 2) - 80
    },
    permissionsTabText:{
        width:230,
        textAlign:"center",
        fontFamily:"Formular-Medium",
        fontSize:16,
        position: "absolute",
        top: 250,
        left: (windowWidth / 2) - 115,
        color:"#fff"
    },
    permissionsTabButton:{
        width: windowWidth - 40,
        height: 50,
        position: "absolute",
        top: 322,
        left:20,
        backgroundColor:"#2C2C2C",
        borderRadius:12
    },
    permissionsTabButtonText:{
        width:"100%",
        textAlign:"center",
        color:"#fff",
        fontFamily: 'Formular-Bold',
        fontSize: 14,
        position:"absolute",
        left:0,
        top:15
    },
    myQrTab:{
        width: "100%",
        height: windowHeight - 150,
        position: "absolute",
        top: 0,
        left: 0
    },
    myQrImage:{
        width:300,
        height:300,
        position:"absolute",
        top:60,
        left:(windowWidth / 2) - 150
    },
    myQrTabText:{
        width: 230,
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 16,
        position: "absolute",
        top: 400,
        left: (windowWidth / 2) - 115,
        color: "#fff"
    },
    tabSelector:{
        width: windowWidth - 40,
        height: 50,
        backgroundColor: "#2C2C2C",
        borderRadius: 12,
        position: "absolute",
        bottom: 90,
        left: 20
    },
    tabSelectorScan:{
        width:"50%",
        height:"100%",
        position:"absolute",
        top:0,
        left:0,
        borderTopLeftRadius:12,
        borderBottomLeftRadius:12,
        backgroundColor:"#A915FF"
    },
    tabSelectorBtnText:{
        width:"100%",
        textAlign:"center",
        fontFamily: 'Formular-Bold',
        fontSize: 14,
        color: "#fff",
        position:"absolute",
        top:15
    },
    tabSelectorMyQr:{
        width: "50%",
        height: "100%",
        position: "absolute",
        top: 0,
        right: 0,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12
    }
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

export default QrScreen