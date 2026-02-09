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

const HomeScreen = ({ navigation }) => {
    const goTopUp = () => {
        navigation.navigate("TopUp");
    }

    const goReservations = () => {
        navigation.navigate("Reservations");
    }

    const goReviews = () => {
        navigation.navigate("ReviewsAuthScreen");
    }

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

    const TopProfile = () => {
        return(
            <View style={styles.profileContainer}>
                <Image style={styles.profileTopIcon} source={require("../assets/images/icon_profile_big.png")} />
                <Text style={styles.profileTopUsername}>Liberty</Text>
                <Text style={styles.profileTopPhone}>+7(900)100-00-00</Text>
            </View>
        );
    }

    const PlaceContainer = () => {
        return(
            <View style={styles.placeContainer}>
                <Image style={styles.placeContainerLogo} source={require("../assets/images/place_logo.png")} />
                <Text style={styles.placeContainerName}>Game empire 1</Text>
                <Text style={styles.placeContainerStatus}>Offline</Text>

                <TouchableOpacity style={styles.placeContainerLogoutBtn}>
                    <Image style={styles.placeContainerLogoutIcon} source={require("../assets/images/icon_logout.png")} />
                </TouchableOpacity>
            </View>
        );
    }

    const ReservationsContainer = () => {
        return(
            <View style={styles.reservationsContainer}>
                <Text style={styles.reservationsContainerText}>Нет бронирований</Text>
                <TouchableOpacity style={styles.reservationsContainerButton} onPress={goReservations}>
                    <Text style={styles.reservationsContainerButtonText}>Забронировать</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const BalanceContainer = () => {
        return(
            <View style={styles.balanceContainer}>
                <View style={styles.balanceContainerMoney}>
                    <Text style={styles.balanceContainerMoneyText}>102 ₽</Text>
                </View>
                <View style={styles.balanceContainerPoints}>
                    <Text style={styles.balanceContainerPointsText}>84</Text>
                    <Image style={styles.balanceContainerPointsIcon} source={require("../assets/images/icon_points.png")} />
                </View>
                <TouchableOpacity style={styles.reservationsContainerButton} onPress={goTopUp}>
                    <Text style={styles.reservationsContainerButtonText}>Пополнить</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const AdditionalServices = () => {
        return (
            <View style={styles.additionalServicesContainer}>
                <TouchableOpacity style={styles.additionalServicesButton}>
                    <Image style={styles.additionalServicesButtonIcon} source={require("../assets/images/icon_reviews.png")} />
                    <Text style={styles.additionalServicesButtonText}>Отзывы</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.additionalServicesButton}>
                    <Image style={styles.additionalServicesButtonIcon} source={require("../assets/images/icon_tarrifs.png")} />
                    <Text style={styles.additionalServicesButtonText}>Тарифы</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.additionalServicesButton}>
                    <Image style={styles.additionalServicesButtonIcon} source={require("../assets/images/icon_products.png")} />
                    <Text style={styles.additionalServicesButtonText}>Пакеты</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.additionalServicesButton}>
                    <Image style={styles.additionalServicesButtonIcon} source={require("../assets/images/icon_hosts.png")} />
                    <Text style={styles.additionalServicesButtonText}>Места</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const PinnedNews = () => {
        return(
            <View style={styles.pinnedNewsContainer}>
                <Image style={styles.pinnedNewsWallpaper} source={require("../assets/images/place_bg.png")} />
                <View style={styles.pinnedNewsWallpaperMask}>
                    <Text style={styles.pinnedNewsTitle}>Обновленный список установленных игр</Text>
                    <Text style={styles.pinnedNewsSubtitle}>Актуальный список предустановленных игр на наших ПК</Text>
                    <Text style={styles.pinnedNewsDate}>14.01</Text>

                    <TouchableOpacity style={styles.pinnedNewsReadBtn}>
                        <Text style={styles.pinnedNewsReadBtnText}>Перейти</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );  
    }

    const Navigation = () => {
        return (
            <View style={navigation_styles.navigationBar}>
                <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goNews}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_news.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goSettings}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_settings.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={navigation_styles.navigationBarButton}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_home_highlighted.png")} />
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

    return (
            <View style={styles.background}>
                <StatusBar />

                <TopProfile />
                <PlaceContainer />
                <ReservationsContainer />
                <BalanceContainer />
                <AdditionalServices />
                <PinnedNews /> 
           
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
        position:"absolute",
        top:0,
        left:0,
        backgroundColor: '#1E1E1E'
    },
    profileContainer:{
        width:"100%",
        height:290,
        position:"absolute",
        top:0,
        left:0
    },  
    profileTopIcon: {
        width: 160,
        height: 160,
        position:"absolute",
        top:45,
        left:(windowWidth / 2) - 80
    },
    profileTopUsername: {
        width:"100%",
        textAlign:"center",
        fontFamily:"Formular-Medium",
        fontSize:16,
        color:"#fff",
        position:"absolute",
        top: 225, 
        left:0
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
    profileTopContainer:{
        width: "100%",
        height: 260,
        position: "absolute",
        top: 0,
        left: 0,
        borderWidth: 2,
        borderColor: "#fff"
    },
    placeContainer:{
        width: windowWidth - 40,
        height: 60,
        position: "absolute",
        top: 290,
        left: 20,
        backgroundColor:"#2C2C2C",
        borderRadius:12
    },
    placeContainerLogo:{
        width:40,
        height:40,
        position:"absolute",
        top:10,
        left:10,
        objectFit:"contain"
    },
    placeContainerName:{
        fontFamily: "Formular-Medium",
        fontSize: 15,
        color: "#fff",
        position: "absolute",
        top: 10,
        left: 65
    },
    placeContainerStatus:{
        fontFamily: "Formular-Medium",
        fontSize: 13,
        color: "rgba(255, 255, 255, .7)",
        position: "absolute",
        bottom: 10,
        left: 65
    },
    placeContainerLogoutBtn:{
        width:40,
        height:40,
        position:"absolute",
        top:10,
        right:10
    },
    placeContainerLogoutIcon:{
        width:40,
        height:40,
        position: "absolute",
        top: 0,
        right: 0
    },
    reservationsContainer:{
        width:(windowWidth - 60) / 2,
        height: 80,
        position: "absolute",
        top: 370,
        left:20,
        backgroundColor: "#2C2C2C",
        borderRadius: 12
    },
    reservationsContainerText:{
        width:"100%",
        textAlign:"center",
        position:"absolute",
        top:12,
        left:0,
        fontFamily:"Formular",
        color:"rgba(255, 255, 255, .6)",
        fontSize:14
    },
    reservationsContainerButton:{
        width:"100%",
        height:36,
        position:"absolute",
        bottom:0,
        left:0,
        borderRadius:12,
        backgroundColor:"#A915FF"
    },
    reservationsContainerButtonText:{
        width:"100%",
        textAlign:"center",
        position:"absolute",
        left:0,
        top:9,
        color:"rgba(255, 255, 255, .9)",
        fontFamily:"Formular-Bold"
    },
    balanceContainer:{
        width: (windowWidth - 60) / 2,
        height: 80,
        position: "absolute",
        top: 370,
        right: 20,
        backgroundColor: "#2C2C2C",
        borderRadius: 12
    },
    balanceContainerMoney:{
        width:"50%",
        height:44,
        position:"absolute",
        top:0,
        left:0
    },
    balanceContainerMoneyText:{
        width:"100%",
        textAlign:"center",
        fontFamily:"Formular",
        fontSize:14,
        color:"rgba(255, 255, 255, .8)",
        position:"absolute",
        top:12
    },
    balanceContainerPoints:{
        width: "50%",
        height: 44,
        position: "absolute",
        top: 0,
        right: 0
    },
    balanceContainerPointsText:{
        width: ((windowWidth - 60) / 4) - 24,
        textAlign: "center",
        fontFamily: "Formular",
        fontSize: 14,
        color: "rgba(255, 255, 255, .8)",
        position: "absolute",
        top: 12
    },
    balanceContainerPointsIcon:{
        width:14,
        height:14,
        position:"absolute",
        top:14,
        left:38
    },
    additionalServicesContainer:{
        width: windowWidth - 100,
        height:(windowWidth - 100) / 4,
        position:"absolute",
        top: 470,
        left: 20,
        display: "flex",
        flexDirection: "row"
    },
    additionalServicesButton:{
        width: (windowWidth - 100) / 4,
        height: (windowWidth - 100) / 4,
        backgroundColor:"#2C2C2C",
        borderRadius:12,
        marginRight:20
    },
    additionalServicesButtonIcon:{
        width: 36,
        height: 36,
        position: "absolute",
        top:5,
        left: ((windowWidth - 100) / 4) / 2 - 18
    },
    additionalServicesButtonText:{
        width:"100%",
        textAlign:"center",
        fontFamily:"Formular-Medium",
        fontSize:12,
        color:"rgba(255, 255, 255, .7)",
        position:"absolute",
        bottom:5, 
        left:0
    },
    pinnedNewsContainer:{
        width:windowWidth - 40,
        height: windowHeight - 95 - (470 + ((windowWidth - 100) / 4)) - 20,
        position:"absolute",
        top: 470 + ((windowWidth - 100) / 4) + 20,
        left: 20,
        borderRadius:12 
    },
    pinnedNewsWallpaperMask:{
        width:"100%",
        height:"100%",
        position:"absolute",
        top:0,
        left:0,
        borderRadius:12,
        backgroundColor:"rgba(16, 16, 16, .6)"
    },
    pinnedNewsTitle:{
        width: windowWidth - 40 - 60,
        textAlign:"left",
        fontFamily:"Formular-Medium",
        fontSize:12,
        color:"#fff",
        marginTop:10,
        marginLeft:10
    },
    pinnedNewsSubtitle:{
        width: windowWidth - 40 - 60,
        textAlign: "left",
        fontFamily: "Formular-Medium",
        fontSize: 10,
        color: "rgba(255, 255, 255, .8)",
        marginTop: 7,
        marginLeft: 10
    },
    pinnedNewsDate:{
        fontFamily: "Formular-Medium",
        fontSize: 12,
        color: "#fff",
        position:"absolute",
        top:10,
        right:10
    },
    pinnedNewsReadBtn:{
        width:windowWidth - 60,
        height:27,
        position:"absolute",
        left:10,
        bottom:10,
        backgroundColor:"#A915FF",
        borderRadius:8
    },
    pinnedNewsReadBtnText:{
        width:"100%",
        fontFamily:"Formular-Bold",
        fontSize: 12,
        textAlign:"center",
        color:"#fff",
        position:"absolute",
        top:6,
        left:0
    },
    pinnedNewsWallpaper:{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        borderRadius: 12
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


export default HomeScreen