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

const TopUpScreen = ({ navigation }) => {
    const Header = () => {
        return(
            <View style={styles.header}>
                <Text style={styles.headerText}>Пополнение счета</Text>

                <TouchableOpacity style={styles.headerButton}>
                    <Image style={styles.headerButtonIcon} source={require("../assets/images/icon_info.png")} />
                </TouchableOpacity>
            </View>
        );
    }

    const AmountInput = () => {
        return(
            <View style={styles.amountInputContainer}>
                <Text style={styles.amountInputContainerTitle}>Сумма пополнения:</Text>
                <TextInput
                    placeholderTextColor="rgba(173, 206, 255, 0.5)"
                    keyboardType='numeric'
                    style={styles.amountInput}
                    placeholder="500"
                    onChange={event => getLoginValue(event)}
                />
                <Image style={styles.amountInputSymbol} source={require("../assets/images/symbol_rouble.png")} />
            </View>
        );
    }

    const FastAmount = () => {
        return(
            <View style={styles.fastAmountContainer}>
                <Text style={styles.fastAmountTitle}>Быстрый выбор суммы:</Text>
                <View style={styles.fastAmountSelector}>
                    <TouchableOpacity style={styles.fastAmountSelectorOption}>
                        <Text style={styles.fastAmountSelectorOptionText}>500 ₽</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.fastAmountSelectorOption}>
                        <Text style={styles.fastAmountSelectorOptionText}>1000 ₽</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.fastAmountSelectorOption}>
                        <Text style={styles.fastAmountSelectorOptionText}>2000 ₽</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const Cashback = () => {
        return(
            <View style={styles.cashbackContainer}>
                <Text style={styles.cashbackContainerTitle}>Кешбек:</Text>
                <View style={styles.cashbackOptions}>
                    <View style={styles.cashbackOption}>
                        <Text style={styles.cashbackOptionText}>5% при пополнении от 500 ₽</Text>
                    </View>
                    <View style={styles.cashbackOption}>
                        <Text style={styles.cashbackOptionText}>7% при пополнении от 1000 ₽</Text>
                    </View>
                    <View style={styles.cashbackOption}>
                        <Text style={styles.cashbackOptionText}>10% при пополнении от 2000 ₽</Text>
                    </View>
                </View>
            </View>
        );
    }

    const PaymentMethodSelector = () => {
        return(
            <View style={styles.paymentMethodContainer}>
                <Text style={styles.paymentMethodContainerTitle}>Способ оплаты:</Text>

                <View style={styles.paymentMethodSelector}>
                    <View style={styles.paymentMethodSelectorOption}>
                        <Text style={styles.paymentMethodSelectorOptionText}>Банковская карта</Text>
                        <Image style={styles.paymentMethodSelectorOptionIcon} source={require("../assets/images/icon_bank_card.png")} />
                    </View>
                    <View style={styles.paymentMethodSelectorOption}>
                        <Text style={styles.paymentMethodSelectorOptionText}>СБП</Text>
                        <Image style={styles.paymentMethodSelectorOptionIcon} source={require("../assets/images/icon_sbp.png")} />
                    </View>
                </View>
            </View>
        );
    }

    const PaymentButton = () => {
        return(
            <View style={styles.paymentButtonContainer}>
                <Text style={styles.paymentButtonContainerText}>Баланс после пополнения: 129 ₽</Text>
                <TouchableOpacity style={styles.paymentButton}>
                    <Text style={styles.paymentButtonText}>Оплатить</Text>
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
        <View style={styles.background}>
            <StatusBar />
            <Header />
            <AmountInput />
            <FastAmount />
            <Cashback />
            <PaymentMethodSelector />
            <PaymentButton />

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
    header:{
        width:"100%",
        height: 22,
        position:"absolute",
        top:50,
        left:0
    },
    headerText:{
        width:windowWidth - 18,
        textAlign:"center",
        fontFamily:"Formular-Medium",
        fontSize:18,
        color:"#fff"
    },
    headerButton:{
        width:18,
        height:18,
        position:"absolute",
        left:(windowWidth / 2) + 85,
        top:4
    },
    headerButtonIcon:{
        width:18,
        height:18,
        position:"absolute",
        top:0,
        left:0
    },
    amountInputContainer:{
        width:windowWidth - 40,
        height:100,
        position:"absolute",
        top:85,
        left:20
    },
    amountInputContainerTitle:{
        width:"100%",
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 14,
        color: "#fff",
        position:"absolute",
        top:0,
        left:0
    },
    amountInput:{
        width:"100%",
        height: 42,
        borderRadius:10,
        backgroundColor:"rgba(0, 0, 0, .4)",
        position:"absolute",
        top:35,
        left:0,
        fontFamily:"Formular",
        fontSize:18,
        color:"#fff",
        textAlign:"center"
    },
    amountInputSymbol:{
        width:18,
        height:18,
        position:"absolute",
        top:47,
        right:10,
        objectFit:"contain",
    },
    fastAmountContainer:{
        width:windowWidth - 40,
        height:80,
        position:"absolute",
        top: 180,
        left: 20
    },
    fastAmountTitle:{
        width: "100%",
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 14,
        color: "#fff",
        position: "absolute",
        top: 0,
        left: 0
    },
    fastAmountSelector:{
        width:"100%",
        height:40,
        position:"absolute",
        top:36,
        left:0,
        display:"flex",
        flexDirection:"row"
    },
    fastAmountSelectorOption:{
        width:(windowWidth - 40 - 40) / 3,
        marginRight:20,
        height:40,
        backgroundColor:"#2C2C2C",
        borderRadius:12
    },
    fastAmountSelectorOptionText:{
        width:"100%",
        textAlign:"center",
        fontFamily:"Formular-Medium",
        fontSize:16,
        color:"#fff",
        position:"absolute",
        left:0,
        top:10
    },
    cashbackContainer:{
        width:windowWidth - 40,
        height:204,
        position:"absolute",
        top:270,
        left:20
    },
    cashbackContainerTitle:{
        width: "100%",
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 14,
        color: "#fff",
        position: "absolute",
        top: 0,
        left: 0
    },
    cashbackOptions:{
        width:"100%",
        height:166,
        position:"absolute",
        top:36,
        left:0,
        display:"flex"
    },
    cashbackOption:{
        width:"100%",
        height:42,
        borderRadius:12,
        backgroundColor:"#2C2C2C",
        marginBottom:20
    },
    cashbackOptionText:{
        width:"100%",
        color:"rgba(255, 255, 255, .7)",
        fontFamily:"Formular-Medium",
        textAlign:"center",
        fontSize:16,
        position:"absolute",
        left:0,
        top:10
    },
    paymentMethodContainer:{
        width: windowWidth - 40,
        height: 204,
        position: "absolute",
        top: 485,
        left: 20
    },
    paymentMethodContainerTitle:{
        width: "100%",
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 14,
        color: "#fff",
        position: "absolute",
        top: 0,
        left: 0
    },
    paymentMethodSelector:{
        width: "100%",
        height: 104,
        position: "absolute",
        top: 36,
        left: 0,
        display: "flex"
    },
    paymentMethodSelectorOption:{
        width: "100%",
        height: 42,
        borderRadius: 12,
        backgroundColor: "#2C2C2C",
        marginBottom: 20
    },
    paymentMethodSelectorOptionText:{
        width: "100%",
        color: "rgba(255, 255, 255, .7)",
        fontFamily: "Formular-Medium",
        textAlign: "center",
        fontSize: 16,
        position: "absolute",
        left: 0,
        top: 10
    },
    paymentMethodSelectorOptionIcon:{
        width:24,
        height:24,
        objectFit:"contain",
        position:"absolute",
        top:9,
        left:12
    },
    paymentButtonContainer:{
        width:windowWidth - 40,
        height:69,
        position:"absolute",
        left:20,
        bottom:90
    },
    paymentButtonContainerText:{
        width:"100%",
        textAlign:"center",
        color:"rgba(255, 255, 255, .7)",
        fontFamily:"Formular",
        position:"absolute",
        top:0,
        left:0
    },
    paymentButton:{
        width:"100%",
        height:42,
        position:"absolute",
        bottom:0,
        left:0,
        borderRadius:12,
        backgroundColor:"#A915FF"
    },
    paymentButtonText:{
        width:"100%",
        fontFamily:"Formular-Bold",
        fontSize:16,
        color:"#fff",
        textAlign:"center",
        position:'absolute',
        top:10,
        left:0
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

export default TopUpScreen