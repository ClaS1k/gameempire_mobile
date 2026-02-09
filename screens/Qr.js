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
                <Image style={styles.permissionsTabIcon} source={require("../assets/images/icon_info.png")} />
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
                <Image style={styles.myQrImage} source={require("../assets/images/icon_info.png")} />
                <Text style={styles.permissionsTabText}>Покажите QR-код администратору</Text>
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
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_home_highlighted.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={navigation_styles.navigationBarButton}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_profile.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={navigation_styles.navigationBarButton}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_qr.png")} />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ backgroundColor: '#1E1E1E' }}>
            <StatusBar />
            <View style={styles.background}>

                <Navigation />
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
    }
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

export default QrScreen