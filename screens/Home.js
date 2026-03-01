import React, { useState, useEffect, useMemo } from 'react';
import {
    Text,
    View,
    Alert,
    StatusBar,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Dimensions,
    Modal
} from 'react-native';

import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

import appConfig from "../appConfig";

const HomeScreen = ({ navigation }) => {
    const [userToken, setUserToken] = useState(false);
    // false - токен еще не загружен или его нет
    const [notificationTitle, setNotificationTitle] = useState("Внимание!");
    const [notificationText, setNotificationText] = useState("Сервисное сообщение.");

    const [username, setUsername] = useState(false);
    const [userPhone, setUserPhone] = useState(false);

    const [userBalance, setUserBalance] = useState(0);
    const [userPoints, setUserPoints] = useState(0);
    const [availableTime, setAvailableTime] = useState(0);
    const [onlineHost, setOnlineHost] = useState(false);

    const [placeName, setPlaceName] = useState(false);
    const [placeLogoPath, setPlaceLogoPath] = useState(false);

    const [actualNewsId, setActualNewsId] = useState(0);
    const [actualNewsTitle, setActualNewsTitle] = useState(false);
    const [actualNewsSubtitle, setActualNewsSubtitle] = useState(false);
    const [actualNewsDate, setActualNewsDate] = useState(false);
    const [actualNewsImagePath, setActualNewsImagePath] = useState(false);

    const [upcomingReservationsList, setUpcomingReservationsList] = useState(false);

    const [upcomingReservationVisible, setUpcomingReservationVisible] = useState(false);
    const [productsVisible, setProductsVisible] = useState(false);
    const [tarrifsVisible, setTarrifsVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);

    const [profileLoading, setProfileLoading] = useState(false);
    const [balanceLoading, setBalanceLoading] = useState(false);
    const [onlineStatusLoading, setOnlineStatusLoading] = useState(false);
    const [actualNewsLoading, setActualNewsLoading] = useState(false);
    const [upcomingReservationsLoading, setUpcomingReservationsLoading] = useState(false);

    const modalPropsReservation = useMemo(() => ({
        animationType: "slide",
        transparent: true,
        visible: upcomingReservationVisible,
        onRequestClose: () => setUpcomingReservationVisible(false),
    }), [upcomingReservationVisible]);

    const modalPropsProducts = useMemo(() => ({
        animationType: "slide",
        transparent: true,
        visible: productsVisible,
        onRequestClose: () => setProductsVisible(false),
    }), [productsVisible]);

    const modalPropsTarrifs = useMemo(() => ({
        animationType: "slide",
        transparent: true,
        visible: tarrifsVisible,
        onRequestClose: () => setTarrifsVisible(false),
    }), [tarrifsVisible]);

    const modalPropsNotification = useMemo(() => ({
        animationType: "slide",
        transparent: true,
        visible: notificationVisible,
        onRequestClose: () => setNotificationVisible(false),
    }), [notificationVisible]);

    const clearDb = async () => {
        await AsyncStorage.clear();
    }

    const getUserTimeFormat = () => {
        // получает время читабельной строкой
        if (availableTime < 60) {
            return "00:00";
        }

        let mins = parseInt(availableTime / 60);
        let hrs = parseInt(mins / 60);
        mins = mins % 60;

        if (mins < 10) {
            mins = "0" + mins;
        }

        if (hrs < 10) {
            hrs = "0" + hrs;
        }

        return `${hrs}:${mins}`;
    }

    const getProfile = () => {
        setProfileLoading(true);

        fetch(appConfig.apiAddress + "profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + userToken.trim()
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);

                        setProfileLoading(false);
                    } catch {
                        setProfileLoading(false);
                    }
                });
            } else {
                return res.text().then(text => {
                    let user_data = JSON.parse(text);
                    user_data = user_data.data;

                    setUsername(user_data.username);
                    setUserPhone(user_data.gizmo_data.phone);
                    setPlaceName(user_data.place.name);
                    setPlaceLogoPath(user_data.place.logo_file.adress);

                    setProfileLoading(false);
                });
            }
        });
    }

    const getBalance = () => {
        setBalanceLoading(true);

        fetch(appConfig.apiAddress + "balance", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + userToken.trim()
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        setBalanceLoading(false);
                    } catch {
                        setBalanceLoading(false);
                    }
                });
            } else {
                return res.text().then(text => {
                    let balance_data = JSON.parse(text);

                    setUserBalance(balance_data.balance);
                    setUserPoints(balance_data.points);
                    setAvailableTime(balance_data.available_time);

                    setBalanceLoading(false);
                });
            }
        });
    }

    const getOnline = () => {
        setOnlineStatusLoading(true);

        fetch(appConfig.apiAddress + "hosts/currenthost", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + userToken.trim()
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        setOnlineStatusLoading(false);
                    } catch {
                        setOnlineStatusLoading(false);
                    }
                });
            } else {
                return res.text().then(text => {
                    let host_data = JSON.parse(text);
                    host_data = host_data.data;
                    
                    if(host_data.is_playing){
                        setOnlineHost(host_data.host_data.hostname);
                    }else{
                        setOnlineHost(false);
                    }

                    setOnlineStatusLoading(false);
                });
            }
        });
    }

    const getUpcomingReservations = () => {
        setUpcomingReservationsLoading(true);

        fetch(appConfig.apiAddress + "reservations", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + userToken.trim()
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        setUpcomingReservationsLoading(false);
                    } catch {
                        setUpcomingReservationsLoading(false);
                    }
                });
            } else {
                return res.text().then(text => {
                    let reservations_data = JSON.parse(text);

                    setUpcomingReservationsList(reservations_data.data)

                    setUpcomingReservationsLoading(false);
                });
            }
        });
    }

    const getActualNews = () => {
        setActualNewsLoading(true);

        fetch(appConfig.apiAddress + "news/last", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + userToken.trim()
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        setActualNewsLoading(false);
                    } catch {
                        setActualNewsLoading(false);
                    }
                });
            } else {
                return res.text().then(text => {
                    let news_data = JSON.parse(text);
                    news_data = news_data.data;

                    setActualNewsId(news_data.id);
                    setActualNewsTitle(news_data.title);
                    setActualNewsSubtitle(news_data.subtitle);
                    setActualNewsDate(news_data.creation_date);
                    setActualNewsImagePath(news_data.wallpaper_file.adress);

                    setActualNewsLoading(false);
                });
            }
        });
    }

    const deleteReservation = () => {
        if (upcomingReservationsList === false || upcomingReservationsList === undefined || upcomingReservationsList == null || upcomingReservationsLoading) {
            // брони по какой-то причине не загружены/загружаются
            return;
        }

        if (upcomingReservationsList.length == 0){
            // у пользователя нет предстоящих броней
            return;
        }

        setUpcomingReservationVisible(false);
        // скрываем поп-ап с предстоящей бронью

        let reservation = upcomingReservationsList[0];

        fetch(appConfig.apiAddress + `reservations/delete/${reservation.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + userToken.trim()
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                    } catch {
                        console.log("Network error");
                    }
                });
            } else {
                getUpcomingReservations();
            }
        });
    }

    const deleteUpcomingReservation = () => {
        Alert.alert(
            'Подтверждение',
            'Вы уверены, что хотите отменить бронь? Если она оплачена - деньги не вернутся.',
            [
                {
                    text: 'Отмена',
                    style: 'cancel',
                },
                {
                    text: 'Удалить',
                    onPress: deleteReservation,
                },
            ],
            {
                cancelable: false
            }
        )
    }

    const logOut = () => {
        clearDb();
        navigation.navigate("PlaceSelector");
    }

    const goTopUp = () => {
        navigation.navigate("TopUp");
    }

    const goReservations = () => {
        navigation.navigate("Reservations");
    }

    const goReviews = () => {
        navigation.navigate("ReviewsAuth");
    }

    const goHosts = () => {
        navigation.navigate("Hostmap");
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
                <Text style={styles.profileTopUsername}>{username ? username : "-"}</Text>
                <Text style={styles.profileTopPhone}>{userPhone ? userPhone : "-"}</Text>
            </View>
        );
    }

    const PlaceContainer = () => {
        return(
            <View style={styles.placeContainer}>
                {(profileLoading && placeLogoPath !== false) ? <ActivityIndicator size="large" color="#fff" style={styles.placeContainerLogoActivityIndicator} /> : <Image style={styles.placeContainerLogo} source={{ uri: placeLogoPath ? placeLogoPath : "" }} />}
                <Text style={styles.placeContainerName}>{placeName ? placeName : "-"}</Text>

                {onlineHost == false ? <Text style={styles.placeContainerStatus}>Offline</Text> : <Text style={styles.placeContainerStatusOnline}>{onlineHost}, доступно {getUserTimeFormat()}</Text>}

                <TouchableOpacity style={styles.placeContainerLogoutBtn} onPress={logOut}>
                    <Image style={styles.placeContainerLogoutIcon} source={require("../assets/images/icon_logout.png")} />
                </TouchableOpacity>
            </View>
        );
    }

    const ReservationsContainer = () => {
        if (upcomingReservationsList === false || upcomingReservationsList === undefined || upcomingReservationsList == null ||  upcomingReservationsLoading){
            // предстоящие брони не загружены - возвращвем стандартный блок
            return(
                <View style={styles.reservationsContainer}>
                    <Text style={styles.reservationsContainerText}>Нет бронирований</Text>
                    <TouchableOpacity style={styles.reservationsContainerButton} onPress={goReservations}>
                        <Text style={styles.reservationsContainerButtonText}>Забронировать</Text>
                    </TouchableOpacity>
                </View>
            );
        }else{
            if (upcomingReservationsList.length == 0){
                // брони загружены, но у пользователя их нет

                return (
                    <View style={styles.reservationsContainer}>
                        <Text style={styles.reservationsContainerText}>Нет бронирований</Text>
                        <TouchableOpacity style={styles.reservationsContainerButton} onPress={goReservations}>
                            <Text style={styles.reservationsContainerButtonText}>Забронировать</Text>
                        </TouchableOpacity>
                    </View>
                );
            }else{
                let reservation = upcomingReservationsList[0];

                let reservation_full_date = reservation.date;

                let date_splitted = reservation_full_date.split("T");
                // date_splitted[0] - Дата бронирования с годом
                // date_splitted[1] - время бронирования

                let display_date = date_splitted[0].split("-");
                display_date = `${display_date[2]}.${display_date[1]}`;

                let display_time = date_splitted[1].split(":");
                display_time = `${display_time[0]}:${display_time[1]}`;

                return (
                    <View style={styles.reservationsContainer}>
                        <Text style={styles.reservationsContainerTextLighted}>Бронь {display_date} на {display_time}</Text>
                        <TouchableOpacity style={styles.reservationsContainerButton} onPress={() => setUpcomingReservationVisible(!upcomingReservationVisible)}>
                            <Text style={styles.reservationsContainerButtonText}>Перейти</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        }
    }

    const BalanceContainer = () => {
        let points_str = userPoints.toString();
        let marginLeft = (4 * points_str.length);

        const pointsIconStyles = {
            width: 14,
            height: 14,
            position: "absolute",
            top: 14,
            left: "50%",
            marginLeft: marginLeft
        };

        return(
            <View style={styles.balanceContainer}>
                <View style={styles.balanceContainerMoney}>
                    <Text style={styles.balanceContainerMoneyText}>{parseInt(userBalance)} ₽</Text>
                </View>
                <View style={styles.balanceContainerPoints}>
                    <Text style={styles.balanceContainerPointsText}>{userPoints}</Text>
                    <Image style={pointsIconStyles} source={require("../assets/images/icon_points.png")} />
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
                <TouchableOpacity style={styles.additionalServicesButton} onPress={goReviews}>
                    <Image style={styles.additionalServicesButtonIcon} source={require("../assets/images/icon_reviews.png")} />
                    <Text style={styles.additionalServicesButtonText}>Отзывы</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.additionalServicesButton} onPress={() => setTarrifsVisible(!tarrifsVisible)}>
                    <Image style={styles.additionalServicesButtonIcon} source={require("../assets/images/icon_tarrifs.png")} />
                    <Text style={styles.additionalServicesButtonText}>Тарифы</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.additionalServicesButton} onPress={() => setProductsVisible(!productsVisible)}>
                    <Image style={styles.additionalServicesButtonIcon} source={require("../assets/images/icon_products.png")} />
                    <Text style={styles.additionalServicesButtonText}>Пакеты</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.additionalServicesButton} onPress={goHosts}>
                    <Image style={styles.additionalServicesButtonIcon} source={require("../assets/images/icon_hosts.png")} />
                    <Text style={styles.additionalServicesButtonText}>Места</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const PinnedNews = () => {
        if (!actualNewsLoading && actualNewsId != 0){
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
        }else{
            return(<View style={styles.pinnedNewsContainer}>
                <ActivityIndicator size="large" color="#fff" style={styles.pinnedNewsContainerActivityIndicator} />
            </View>);
        }
    }

    const showNotificationPopup = (title, text) => {
        setNotificationTitle(title);
        setNotificationText(text);

        setNotificationVisible(!notificationVisible);
    }

    const NotificationPopup = () => {
        return (
            <Modal {...modalPropsNotification}>
                <View style={styles.popupView}>
                    <Text style={styles.notificationTitle}>{notificationTitle}</Text>
                    <Text style={styles.notificationText}>{notificationText}</Text>

                    <TouchableOpacity style={styles.popupViewCloseButton} onPress={() => setNotificationVisible(!notificationVisible)}>
                        <Text style={styles.popupViewCloseButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
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

    const UpcomingReservationPopUp = () => {
        if (upcomingReservationsList === false || upcomingReservationsList === undefined || upcomingReservationsList == null || upcomingReservationsLoading) {
            return;
        }

        if (upcomingReservationsList.length == 0){
            return;
        }

        let date_str = `-`;
        let host_str = `-`;
        let product_str = `-`;
        let payment_method_str = `-`;

        let reservation = upcomingReservationsList[0];

        // форматируем дату
        let reservation_full_date = reservation.date;  

        let date_splitted = reservation_full_date.split("T");
        // date_splitted[0] - Дата бронирования с годом
        // date_splitted[1] - время бронирования

        let display_date = date_splitted[0].split("-");
        let display_time = date_splitted[1].split(":");
        
        date_str = `${display_date[2]}.${display_date[1]}.${display_date[0]} ${display_time[0]}:${display_time[1]}`;

        // форматируем хост
        host_str = `${reservation.host.hostgroup}, ${reservation.host.name}`;

        // форматируем пакет
        product_str = reservation.app_data.product_name === false ? "Не предусмотрен" : reservation.app_data.product_name;

        if (reservation.app_data.payment_method === false){
            payment_method_str = `Не оплачено`;
        }else{
            payment_method_str = reservation.app_data.payment_method == 0 ? "С баланса" : "Баллами"; 
        }

        return (
            <Modal {...modalPropsReservation}>
                <View style={styles.popupView}>
                    <Text style={styles.popupViewTitle}>Предстоящая бронь</Text>
                    <View style={styles.reservationsPopupDate}>
                        <Image style={styles.reservationsPopupDateIcon} source={require("../assets/images/icon_calendar.png")} />
                        <Text style={styles.reservationsPopupDateText}>{date_str}</Text>
                    </View>
                    <View style={styles.reservationsPopupHost}>
                        <Image style={styles.reservationsPopupHostIcon} source={require("../assets/images/icon_host_big.png")} />
                        <Text style={styles.reservationsPopupHostText}>{host_str}</Text>
                    </View>
                    <View style={styles.reservationsPopupProduct}>
                        <Image style={styles.reservationsPopupProductIcon} source={require("../assets/images/icon_products.png")} />
                        <Text style={styles.reservationsPopupProductText}>{product_str}</Text>
                    </View>
                    <View style={styles.reservationsPopupPayment}>
                        <Image style={styles.reservationsPopupPaymentIcon} source={require("../assets/images/icon_payment_method.png")} />
                        <Text style={styles.reservationsPopupPaymentText}>{payment_method_str}</Text>
                    </View>

                    <View style={styles.reservationsPopupDeclineWarning}>
                        <Image style={styles.reservationsPopupDeclineWarningIcon} source={require("../assets/images/icon_info.png")} />
                        <Text style={styles.reservationsPopupDeclineWarningText}>При отмене брони средства не вернутся</Text>
                    </View>

                    <TouchableOpacity style={styles.reservationsPopupDeclineButton} onPress={deleteUpcomingReservation}>
                        <Text style={styles.reservationsPopupDeclineButtonText}>Отменить</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.popupViewCloseButton} onPress={() => setUpcomingReservationVisible(!upcomingReservationVisible)}>
                        <Text style={styles.popupViewCloseButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    const ProductsPopUp = () => {
        return (
            <Modal {...modalPropsProducts}>
                <View style={styles.popupView}>
                    <TouchableOpacity style={styles.popupViewCloseButton} onPress={() => setProductsVisible(!productsVisible)}>
                        <Text style={styles.popupViewCloseButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    const TarrifsPopUp = () => {
        return (
            <Modal {...modalPropsTarrifs}>
                <View style={styles.popupView}>
                    <TouchableOpacity style={styles.popupViewCloseButton} onPress={() => setTarrifsVisible(!tarrifsVisible)}>
                        <Text style={styles.popupViewCloseButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    useEffect(() => {
        AsyncStorage.getItem("TOKEN").then((value) => { 
            if (value !== null) {
                setUserToken(value);
            } else {
                navigation.navigate("SignIn");
            }
        });
    }, []);

    useEffect(() => {
        if(userToken !== false && userToken !== null){
            getProfile();
            getBalance();
            getActualNews();
            getOnline();
            getUpcomingReservations();
        }
    }, [userToken]);

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

                <UpcomingReservationPopUp />
                <ProductsPopUp />
                <TarrifsPopUp />
                <NotificationPopup />
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
        left:12,
        objectFit:"contain"
    },
    placeContainerLogoActivityIndicator:{
        width: 40,
        height: 40,
        position: "absolute",
        top: 12,
        left: 12
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
    placeContainerStatusOnline: {
        fontFamily: "Formular-Medium",
        fontSize: 13,
        color: "#75F66C",
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
    reservationsContainerTextLighted:{
        width: "100%",
        textAlign: "center",
        position: "absolute",
        top: 12,
        left: 0,
        fontFamily: "Formular",
        color: "#fff",
        fontSize: 13
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
        width: ((windowWidth - 60) / 4) - 15,
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
        borderRadius:12,
        backgroundColor:"#2C2C2C"
    },
    pinnedNewsContainerActivityIndicator:{
        width:40,
        height:40,
        position:"absolute",
        top:"50%",
        left:"50%",
        marginTop:-20,
        marginLeft:-20
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
    },
    popupView:{
        width:"100%",
        height:windowHeight - 200,
        position:"absolute",
        bottom:0,
        left:0,
        backgroundColor:"#2C2C2C",
        borderTopLeftRadius:12,
        borderTopRightRadius:12
    },
    popupViewTitle:{
        width:"100%",
        textAlign:"center",
        fontFamily:"Formular-Medium",
        fontSize:20,
        color:"#fff",
        position:"absolute",
        top:20,
        left:0
    },
    popupViewCloseButton:{
        width:windowWidth - 40,
        height:50,
        position:"absolute",
        bottom:25,
        left:20,
        borderRadius:12,
        backgroundColor:"#A915FF"
    },
    popupViewCloseButtonText:{
        width:"100%",
        textAlign:"center",
        color:"#fff",
        fontFamily:"Formular-Bold",
        position:'absolute',
        left:0,
        top:15
    },  
    reservationsPopupDate:{
        width:(windowWidth - 60) / 2,
        height: (windowWidth - 60) / 2,
        position:"absolute",
        top:64,
        left:20,
        backgroundColor:"#383838",
        borderRadius:12
    },
    reservationsPopupDateIcon:{
        width: (windowWidth - 220) / 2,
        height: (windowWidth - 220) / 2,
        objectFit:"contain",
        position:"absolute",
        top:20,
        left: (((windowWidth - 60) / 2) / 2) - ((windowWidth - 220) / 4)
    },
    reservationsPopupDateText:{
        width:"100%",
        textAlign:"center",
        fontFamily:"Formular-Medium",
        fontSize:14,
        color:"#fff",
        position:"absolute",
        bottom:20,
        left:0
    },
    reservationsPopupHost:{
        width: (windowWidth - 60) / 2,
        height: (windowWidth - 60) / 2,
        position: "absolute",
        top: 64,
        right: 20,
        backgroundColor: "#383838",
        borderRadius: 12
    },
    reservationsPopupHostIcon:{
        width: (windowWidth - 220) / 2,
        height: (windowWidth - 220) / 2,
        objectFit: "contain",
        position: "absolute",
        top: 20,
        left: (((windowWidth - 60) / 2) / 2) - ((windowWidth - 220) / 4)
    },
    reservationsPopupHostText:{
        width: "100%",
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 14,
        color: "#fff",
        position: "absolute",
        bottom: 20,
        left: 0
    },
    reservationsPopupProduct:{
        width:windowWidth - 40,
        height:50,
        position:"absolute",
        top: 64 + (windowWidth - 60) / 2 + 20,
        left:20,
        borderRadius:12,
        backgroundColor:"#383838"
    },
    reservationsPopupProductIcon:{
        width:28,
        height:28,
        position:"absolute",
        top:11,
        left:11,
        objectFit:"contain"
    },  
    reservationsPopupProductText:{
        width:"100%",
        textAlign:"center",
        color:"#fff",
        fontFamily:"Formular-Medium",
        position:"absolute",
        top:15,
        left:0
    },
    reservationsPopupPayment:{
        width: windowWidth - 40,
        height: 50,
        position: "absolute",
        top: 64 + (windowWidth - 60) / 2 + 20 + 50 + 20,
        left: 20,
        borderRadius: 12,
        backgroundColor: "#383838"
    },
    reservationsPopupPaymentIcon:{
        width: 28,
        height: 28,
        position: "absolute",
        top: 11,
        left: 11,
        objectFit: "contain"
    },
    reservationsPopupPaymentText:{
        width: "100%",
        textAlign: "center",
        color: "#fff",
        fontFamily: "Formular-Medium",
        position: "absolute",
        top: 15,
        left: 0
    },
    reservationsPopupDeclineButton:{
        width: windowWidth - 40,
        height: 50,
        position: "absolute",
        bottom: 95,
        left: 20,
        borderRadius: 12,
        backgroundColor: "#A915FF"
    },
    reservationsPopupDeclineButtonText:{
        width: "100%",
        textAlign: "center",
        color: "#fff",
        fontFamily: "Formular-Bold",
        position: 'absolute',
        left: 0,
        top: 15
    },
    reservationsPopupDeclineWarning:{
        width:"100%",
        height:14,
        position:"absolute",
        left:0,
        bottom:155
    },
    reservationsPopupDeclineWarningIcon:{
        width:12,
        height:12,
        position:"absolute",
        top:2,
        left: (windowWidth / 2) - 140
    },
    reservationsPopupDeclineWarningText:{
        width:"100%",
        textAlign:'center',
        position:"absolute",
        top:0,
        left:0,
        fontFamily:"Formular",
        fontSize:12,
        color:"#fff"
    },
    notificationTitle:{
        width:"100%",
        textAlign:"center",
        fontFamily:"Formular-Medium",
        fontSize:18,
        position:"absolute",
        top:10,
        left:0,
        color:"#fff"
    },
    notificationText:{
        width:windowWidth - 40,
        height: windowHeight - 360,
        textAlign:"center",
        color:"#fff",
        fontFamily:"Formular",
        position:"absolute",
        left:20,
        top:60
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