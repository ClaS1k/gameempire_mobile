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
                <Text style={styles.headerText}>Добавление брони</Text>
                <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_info.png")} />
            </View>
        );
    }

    const AmountInput = () => {
        return(
            <View style={styles.amountInputContainer}>
                <Text style={styles.amountInputContainerTitle}>Сумма пополнения:</Text>
                <TextInput
                    placeholderTextColor="rgba(173, 206, 255, 0.5)"
                    style={styles.amountInput}
                    placeholder="500"
                    onChange={event => getLoginValue(event)}
                />
            </View>
        );
    }

    const FastAmount = () => {
        return(
            <View style={styles.fastAmountContainer}>
                <Text style={styles.amountInputContainerTitle}>Быстрый выбор суммы:</Text>
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
                <Text style={styles.cashbackContainerTitle}>Способ оплаты:</Text>

                <View style={styles.paymentMethodSelector}>
                    <View style={styles.paymentMethodSelectorOption}>
                        <Text style={styles.paymentMethodSelectorOptionText}>Банковская карта</Text>
                        <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_info.png")} />
                    </View>
                    <View style={styles.paymentMethodSelectorOption}>
                        <Text style={styles.paymentMethodSelectorOptionText}>СБП</Text>
                        <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_info.png")} />
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

export default TopUpScreen