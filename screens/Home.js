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
    const TopProfile = () => {
        return (
            <View styles={styles.profileTop}>
                <Image style={styles.profileTopIcon} source={require("../assets/images/icon_list_highlighted.png")} />
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
                <TouchableOpacity style={styles.reservationsContainerButton}>
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
                    <Image style={styles.balanceContainerPointsIcon} source={require("../assets/images/icon_list_highlighted.png")} />
                </View>
            </View>
        );
    }

    const AdditionalServices = () => {
        return (
            <View style={styles.additionalServicesContainer}>
                <TouchableOpacity style={styles.additionalServicesButton}>
                    <Image style={styles.balanceContainerPointsIcon} source={require("../assets/images/icon_reviews.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.additionalServicesButton}>
                    <Image style={styles.balanceContainerPointsIcon} source={require("../assets/images/icon_tarrifs.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.additionalServicesButton}>
                    <Image style={styles.balanceContainerPointsIcon} source={require("../assets/images/icon_products.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.additionalServicesButton}>
                    <Image style={styles.balanceContainerPointsIcon} source={require("../assets/images/icon_hosts.png")} />
                </TouchableOpacity>
            </View>
        );
    }

    const PinnedNews = () => {
        return(
            <View style={styles.pinnedNewsContainer}>
                <View style={styles.pinnedNewsWallpaperMask}>
                    <Text style={styles.pinnedNewsTitle}>Обновленный список установленных игр</Text>
                    <Text style={styles.pinnedNewsSubtitle}>Актуальный список предустановленных игр на наших ПК</Text>
                    <Text style={styles.pinnedNewsDate}>14.01</Text>

                    <TouchableOpacity style={styles.pinnedNewsReadBtn}>
                        <Text style={styles.pinnedNewsReadBtnText}>Перейти</Text>
                    </TouchableOpacity>
                </View>
                <Image style={styles.pinnedNewsWallpaper} source={require("../assets/images/place_bg.png")} />
            </View>
        );  
    }

    const Navigation = () => {
        return (
            <View style={styles.navigationBar}>
                <TouchableOpacity style={styles.navigationBarButton}>
                    <Image style={styles.navigationBarButtonIcon} source={require("../assets/images/icon_list_highlighted.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navigationBarButton}>
                    <Image style={styles.navigationBarButtonIcon} source={require("../assets/images/icon_map.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navigationBarButton}>
                    <Image style={styles.navigationBarButtonIcon} source={require("../assets/images/icon_settings.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navigationBarButton}>
                    <Image style={styles.navigationBarButtonIcon} source={require("../assets/images/icon_settings.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navigationBarButton}>
                    <Image style={styles.navigationBarButtonIcon} source={require("../assets/images/icon_settings.png")} />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ backgroundColor: '#1E1E1E' }}>
            <StatusBar />
            <View style={styles.background}>
                <TopProfile />
                <PlaceContainer />
                <ReservationsContainer />
                <BalanceContainer />
                <AdditionalServices />
                <PinnedNews />

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

export default HomeScreen