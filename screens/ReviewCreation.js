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
import AsyncStorage from '@react-native-async-storage/async-storage';

import appConfig from "../appConfig";

const ReviewCreationScreen = ({ navigation, route }) => {
    const [userToken, setUserToken] = useState(false);
    // false - токен еще не загружен или его нет

    const [reviewText, setReviewText] = useState("");
    const [rate, setRate] = useState(0);

    const [reviewCreationLoading, setReviewCreationLoading] = useState(false);
    

    const getReviewValue = e => {
        setReviewText(e.nativeEvent.text.trim());
    }

    const createReview = () => {
        if (reviewText.length == 0 || rate == 0){
            return;
        }

        setReviewCreationLoading(true);

        let body = {
            "text": reviewText,
            "rate": rate
        }

        let xhr = new XMLHttpRequest();
        let adress = encodeURI(appConfig.apiAddress + "reviews/create");
        xhr.open('POST', adress, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer ' + userToken);
        xhr.send(JSON.stringify(body));
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    navigation.navigate("ReviewsAuth", { place_id: route.params.place_id });
                } else {
                    try {
                        let response = JSON.parse(xhr.responseText);

                        Alert.alert("Ошибка!", response.message);
                        // setErrorMessage(response.message);
                    } catch {
                        Alert.alert("Неизвестная ошибка");

                        console.log(xhr.responseText);

                        // setErrorMessage("Неизвестная ошибка");
                    }
                }

                setReviewCreationLoading(false);
            }
        }
    }

    const RateSelector = () => {
        let stars = [];

        // формируем звезды
        for(let i = 1; i<=5; i++){
            stars.push(<TouchableOpacity key={i} onPress={() => { setRate(i) }} style={styles.rateSelectorItem}>
                {(rate >= i) ? <Image style={styles.rateSelectorItemIcon} source={require("../assets/images/rate_star_lighted.png")} /> : <Image style={styles.rateSelectorItemIcon} source={require("../assets/images/rate_star.png")} />}
            </TouchableOpacity>);
        }

        return(<View style={styles.rateSelectorContainer}>
            {stars.map((item, index) => item)}
        </View>);
    }

   const Navigation = () => {
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
   
           const goHome = () => {
               navigation.navigate("Home");
           }
   
           return (
               <View style={navigation_styles.navigationBar}>
                   <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goNews}>
                       <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_news.png")} />
                   </TouchableOpacity>
                   <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goSettings}>
                       <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_settings.png")} />
                   </TouchableOpacity>
                   <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goHome}>
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

    useEffect(() => {
        AsyncStorage.getItem("TOKEN").then((value) => {
            if (value !== null) {
                setUserToken(value);
            } else {
                navigation.navigate("PlaceSelector");
            }
        });
    }, []);

    useEffect(() => {
        if (userToken !== false && userToken !== null) {
            console.log("Initialization");
        }
    }, [userToken]);

    return (
        <View style={styles.background}>
            <StatusBar />

            <Text style={styles.windowTitle}>Оставить отзыв</Text>

            <RateSelector />

            <TextInput
                placeholderTextColor="rgba(173, 206, 255, 0.5)"
                style={styles.reviewInput}
                placeholder="Текст отзыва"
                onChange={event => getReviewValue(event)}
            />

            <Text style={reviewText.length > 300 ? styles.symbolsLimitHighlighted : styles.symbolsLimit}>{reviewText.length}/300</Text>

            {(reviewText.length > 0 && reviewText.length <= 300) ? <TouchableOpacity onPress={createReview} style={styles.publishReviewButton}>
                <Text style={styles.publishReviewButtonText}>Опубликовать</Text>
            </TouchableOpacity> : false}

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
    windowTitle: {
        width:"100%",
        textAlign:"center",
        color:"#fff",
        fontFamily:"Formular-Medium",
        fontSize:20,
        position:"absolute",
        top:50,
        left:0
    },
    rateSelectorContainer: {
        width:windowWidth - 40,
        height:50,
        position:"absolute",
        top:100,
        left:20,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-around"
    },
    rateSelectorItem:{
        width:50,
        height:50,
        display:"flex"
    },
    rateSelectorItemIcon:{
        width:50,
        height:50,
        objectFit:"contain"
    },
    reviewInput: {
        width: windowWidth - 40,
        height: 40,
        fontFamily: "Formular",
        fontSize: 18,
        backgroundColor: "rgba(0, 0, 0, .4)",
        borderRadius: 12,
        position: "absolute",
        top: 170,
        left: 20,
        textAlign: "center",
        color: "#fff"
    },
    symbolsLimitHighlighted:{
        width:"100%",
        textAlign:"center",
        color:"#FFABAC",
        fontFamily:"Formular",
        fontSize:12,
        position:"absolute",
        top:220,
        left:0
    },
    symbolsLimit:{
        width: "100%",
        textAlign: "center",
        color: "rgba(255, 255, 255, .8)",
        fontFamily: "Formular",
        fontSize: 12,
        position: "absolute",
        top: 220,
        left: 0
    },
    publishReviewButton: {
        width: windowWidth - 40,
        height: 42,
        position: "absolute",
        bottom: 90,
        left: 20,
        borderRadius: 12,
        backgroundColor: "#A915FF"
    },
    publishReviewButtonText: {
        width: "100%",
        fontFamily: "Formular-Bold",
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
        position: 'absolute',
        top: 10,
        left: 0
    },
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

export default ReviewCreationScreen