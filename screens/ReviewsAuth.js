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

const ReviewsAuthScreen = ({ navigation }) => {
    const Reviews = () => {
        return(
            <ScrollView style={styles.reviewsContainer}>
                <View style={styles.reviewContainer}>
                    <Text style={styles.reviewAuthor}>Liberty</Text>
                    <Text style={styles.reviewDate}>Оставлен 16.01.2025г</Text>
                    <Text style={styles.reviewText}>Текст отзыва Владимира про компьютерный клуб, рястянутый на пару строк, чтоб проверить макет</Text>
                    <View style={styles.reviewRate}>
                        <Image style={styles.reviewRateIcon} source={require("../assets/images/icon_star.png")} />
                        <Text style={styles.reviewRateValue}>5</Text>
                    </View>
                </View>
            </ScrollView>
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
        <View style={styles.background}>
            <StatusBar />

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
    reviewsContainer: {
        width: "100%",
        height: windowHeight - 90,
        position: "absolute",
        paddingTop: 50,
        top: 0,
        left: 0
    },
    reviewContainer: {
        width: windowWidth - 40,
        height: "auto",
        borderRadius: 12,
        backgroundColor: "#2c2c2c",
        marginBottom: 20,
        marginLeft: 20
    },
    reviewAuthor: {
        fontFamily: "Formular-Medium",
        fontSize: 14,
        marginTop: 7,
        marginLeft: 9,
        color: "#fff"
    },
    reviewDate: {
        fontFamily: "Formular-Medium",
        fontSize: 12,
        marginTop: 5,
        marginLeft: 9,
        color: "rgba(255, 255, 255, .7)"
    },
    reviewText: {
        width: windowWidth - 40 - 18,
        fontFamily: "Formular-Medium",
        fontSize: 12,
        marginTop: 7,
        marginLeft: 9,
        color: "#fff",
        marginBottom: 9
    },
    reviewRate: {
        width: 25,
        height: 15,
        position: "absolute",
        top: 7,
        right: 9
    },
    reviewRateIcon: {
        width: 14,
        height: 14,
        position: "absolute",
        right: 0,
        top: 1
    },
    reviewRateValue: {
        fontFamily: "Formular-Medium",
        fontSize: 12,
        color: "#fff",
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

export default ReviewsAuthScreen