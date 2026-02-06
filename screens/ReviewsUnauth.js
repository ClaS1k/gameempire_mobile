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

const ReviewsUnauthScreen = ({ navigation }) => {
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

export default ReviewsUnauthScreen