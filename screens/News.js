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
// import AsyncStorage from '@react-native-async-storage/async-storage';

import appConfig from "../appConfig";

const NewsScreen = ({ navigation }) => {
    const NewsList = () => {
        return(
            <ScrollView style={styles.newsContainer}>
                <View style={styles.newsItem}>
                    <Image style={styles.newsItemWallpaper} source={require("../assets/images/place_bg.png")} />

                    <View style={styles.newsItemMask}>
                        <Text style={styles.newsItemTitle}>Обновленный список установленных игр</Text>
                        <Text style={styles.newsItemSubtitle}>Актуальный список предустановленных игр на наших ПК</Text>
                        <Text style={styles.newsItemDate}>14.01</Text>
                        <TouchableOpacity style={styles.newsItemReadButton}>
                            <Text style={styles.newsItemReadButtonText}>Перейти</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }

    const Navigation = () => {
        return (
            <View style={navigation_styles.navigationBar}>
                <TouchableOpacity style={navigation_styles.navigationBarButton}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_news_highlighted.png")} />
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
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_qr.png")} />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.background}>
            <StatusBar />

            <NewsList />

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
    newsContainer:{
        width:"100%",
        height:windowHeight - 90,
        position:"absolute",
        top:0,
        left:0,
        paddingTop:50
    },
    newsItem:{
        width: windowWidth - 40,
        height: 160,
        marginBottom: 20,
        marginLeft: 20,
        borderRadius: 12
    },
    newsItemWallpaper:{
        width: windowWidth - 40,
        height: 160,
        position:"absolute",
        top:0,
        left:0,
        borderRadius: 12,
        objectFit:"cover"
    },
    newsItemMask:{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor:"rgba(16, 16, 16, .6)",
        borderRadius:12
    },
    newsItemTitle:{
        width:windowWidth - 40 - 12 - 60,
        fontFamily: 'Formular-Medium',
        fontSize: 14,
        marginTop: 12,
        marginLeft: 12,
        color: "#fff"
    },
    newsItemSubtitle:{
        width: windowWidth - 40 - 12 - 60,
        fontFamily: 'Formular-Medium',
        fontSize: 10,
        marginTop: 5,
        marginLeft: 12,
        color: "rgba(255, 255, 255, .8)"
    },
    newsItemDate:{
        fontFamily: 'Formular-Medium',
        fontSize: 14,
        position: "absolute",
        top: 12,
        right: 12,
        color: "#fff"
    },
    newsItemReadButton:{
        width: windowWidth - 60,
        height: 27,
        position: "absolute",
        left: 10,
        bottom: 10,
        backgroundColor: "#A915FF",
        borderRadius: 8
    },
    newsItemReadButtonText:{
        width: "100%",
        fontFamily: "Formular-Bold",
        fontSize: 12,
        textAlign: "center",
        color: "#fff",
        position: "absolute",
        top: 6,
        left: 0
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

export default NewsScreen