import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    ScrollView,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Dimensions,
    Alert,
    Touchable
} from 'react-native';

import * as Font from 'expo-font';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import appConfig from "../appConfig";
// import { ScrollView } from 'react-native/types_generated/index';

const PlaceSelectorScreen = ({ navigation }) => {
    const selectPlace = () => {
        navigation.navigate("SignIn");
    }

    const loadFonts = async () => {
        await Font.loadAsync({
            'Formular': require('../assets/fonts/Formular.ttf'),
            'Formular-Bold': require('../assets/fonts/Formular-Bold.ttf'),
            'Formular-Italic': require('../assets/fonts/Formular-Italic.ttf'),
            'Formular-Light': require('../assets/fonts/Formular-Light.ttf'),
            'Formular-Medium': require('../assets/fonts/Formular-Medium.ttf'),

        });
    };

    useEffect(() => {
        loadFonts();
    }, []);

    const PlacesList = () => {
        return (
            <ScrollView style={styles.placesScrollView}>
                <TouchableOpacity style={styles.placesItem} onPress={selectPlace}>
                    <Image style={styles.placesItemWallpaper} source={require("../assets/images/place_bg.png")} />
                    <View style={styles.placesItemWallpaperMask}></View>

                    <Text style={styles.placesItemName}>Game Empire 1</Text>
                    <Text style={styles.placesItemDescription}>Комфортная кибер-арена на 55 ПК, разделенная на 5 залов и 3 дополнительные комнаты с PlayStation 5</Text>
                    <View style={styles.placesItemDistance}>
                        <Image style={styles.placesItemDistanceIcon} source={require("../assets/images/icon_location.png")} />
                        <Text style={styles.placesItemDistanceText}>253м</Text>
                    </View>
                    <View style={styles.placesItemRate}>
                        <Image style={styles.placesItemRateIcon} source={require("../assets/images/icon_star_alt.png")} />
                        <Text style={styles.placesItemRateText}>4.6</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        );
    }
    
    const PlacesNavigation = () => {
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
            </View>
        );
    }

    return (
        <SafeAreaView style={{ backgroundColor: '#1E1E1E' }}>
            <StatusBar />
            <View style={styles.background}>
                <PlacesList />
                
                <PlacesNavigation />
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
    },
    placesScrollView:{
        width:"100%",
        height: windowHeight - 140,
        position: "absolute",
        top:40,
        left:0
    },
    placesItem:{
        width: windowWidth - 50,
        height: 160,
        marginTop:10,
        marginBottom:15,
        marginLeft:25,
        borderRadius:12
    },
    placesItemWallpaper:{
        width:"100%",
        height:"100%",
        position:"absolute",
        top:0,
        left:0,
        borderRadius:12,
        objectFit:"cover"
    },
    placesItemWallpaperMask:{
        width:"100%",
        height:"100%",
        position:"absolute",
        top:0,
        left:0,
        borderRadius:12,
        backgroundColor:"rgba(0,0,0,0.5)"
    },
    placesItemName:{
        fontFamily: 'Formular-Medium',
        fontSize:14,
        position:"absolute",
        top:12,
        left:12,
        color:"#fff"
    },
    placesItemDescription:{
        width: windowWidth - 50 - 24,
        fontFamily: 'Formular',
        fontSize: 10,
        position: "absolute",
        bottom: 12,
        left: 12,
        color: "rgba(255, 255, 255, .8)"
    },
    placesItemDistance:{
        width:100,
        height:14,
        position:"absolute",
        top:13,
        right:12
    },
    placesItemDistanceIcon:{
        width:14,
        height:14,
        objectFit:"contain",
        position:"absolute",
        top:1,
        right:0
    },
    placesItemDistanceText:{
        fontFamily: 'Formular',
        fontSize: 12,
        position: "absolute",
        top: 0,
        right: 17,
        color: "rgba(255, 255, 255, .75)",
        textAlign:"right"
    },
    placesItemRate:{
        width: 100,
        height: 14,
        position: "absolute",
        top: 33,
        right: 12
    },
    placesItemRateIcon:{
        width: 14,
        height: 14,
        objectFit: "contain",
        position: "absolute",
        top: 1,
        right: 0
    },
    placesItemRateText:{
        fontFamily: 'Formular',
        fontSize: 12,
        position: "absolute",
        top: 0,
        right: 17,
        color: "rgba(255, 255, 255, .75)",
        textAlign: "right"
    },
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
        width: 40,
        height: 40,
        display: "flex",
        flexDirection: "row",
        marginTop: 5
    },
    navigationBarButtonIcon: {
        width: 40,
        height: 40
    }
});

export default PlaceSelectorScreen