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

const ReservationsScreen = ({ navigation }) => {
    const Header = () => {
        return(
            <View style={styles.header}>
                <Text style={styles.headerText}>Добавление брони</Text>
    
                <TouchableOpacity style={styles.headerButton}>
                    <Image style={styles.headerButtonIcon} source={require("../assets/images/icon_info.png")} />
                </TouchableOpacity>
            </View>
        );
    }

    const DateSelector = () => {
        return(
            <View style={styles.dateSelector}>
                <Text style={styles.dateSelectorTitle}>Выберите дату</Text>
                <View style={styles.dateLine}>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>ПН</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>ВТ</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>СР</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>ЧТ</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>ПТ</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>СБ</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>ВС</Text>
                    </View>
                </View>
                <Text style={styles.monthLine}>Январь 2026</Text>
                <View style={styles.dateLine}>
                    <View style={styles.dateLineItem}>
                    </View>
                    <View style={styles.dateLineItem}>
                    </View>
                    <View style={styles.dateLineItem}>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>1</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>2</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>3</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>4</Text>
                    </View>
                </View>
                <View style={styles.dateLine}>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>5</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>6</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>7</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>8</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>9</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>10</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>11</Text>
                    </View>
                </View>
                <View style={styles.dateLine}>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>12</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>13</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>14</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>15</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>16</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>17</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>18</Text>
                    </View>
                </View>
                <Text style={styles.monthLine}>Февраль 2026</Text>
                <View style={styles.dateLine}>
                    <View style={styles.dateLineItem}>
                    </View>
                    <View style={styles.dateLineItem}>
                    </View>
                    <View style={styles.dateLineItem}>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>1</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>2</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>3</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>4</Text>
                    </View>
                </View>
                <View style={styles.dateLine}>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>5</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>6</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>7</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>8</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>9</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>10</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>11</Text>
                    </View>
                </View>
                <View style={styles.dateLine}>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>12</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>13</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>14</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>15</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>16</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>17</Text>
                    </View>
                    <View style={styles.dateLineItem}>
                        <Text style={styles.dateLineItemText}>18</Text>
                    </View>
                </View>
            </View>
        );
    }

    const NextStepBtn = () => {
        return(
            <TouchableOpacity style={styles.nextStepButton}>
                <Text style={styles.nextStepButtonText}>Продолжить</Text>
            </TouchableOpacity>
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

            <Header />
            <DateSelector />

            <NextStepBtn />
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
    header: {
        width: "100%",
        height: 22,
        position: "absolute",
        top: 50,
        left: 0
    },
    headerText: {
        width: windowWidth - 18,
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 18,
        color: "#fff"
    },
    headerButton: {
        width: 18,
        height: 18,
        position: "absolute",
        left: (windowWidth / 2) + 85,
        top: 4
    },
    headerButtonIcon: {
        width: 18,
        height: 18,
        position: "absolute",
        top: 0,
        left: 0
    },
    dateSelector:{
        width:windowWidth - 40,
        height:"auto",
        position:"absolute",
        top:90,
        left:20
    },
    dateSelectorTitle:{
        width:"100%",
        textAlign:"center",
        color:"#fff",
        fontFamily:"Formular-Medium",
        fontSize:14
    },
    dateLine:{  
        width:"100%",
        height:17,
        marginTop:20,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-evenly"
    },
    dateLineItem:{
        width:36,
        height:17,
    },
    dateLineItemText:{
        width:"100%",
        textAlign:"center",
        color:"#fff",
        fontFamily:"Formular-Medium",
        fontSize:14,
        marginTop:2
    },
    monthLine:{
        width:"100%",
        fontFamily:"Formular-Medium",
        textAlign:"center",
        color:"#fff",
        fontSize:16,
        marginTop:20
    },
    nextStepButton:{
        width: windowWidth - 40,
        height: 42,
        position: "absolute",
        bottom: 90,
        left: 20,
        borderRadius: 12,
        backgroundColor: "#A915FF"
    },
    nextStepButtonText:{
        width: "100%",
        fontFamily: "Formular-Bold",
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
        position: 'absolute',
        top: 10,
        left: 0
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

export default ReservationsScreen