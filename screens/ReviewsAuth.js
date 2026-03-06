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

const ReviewsAuthScreen = ({ navigation, route }) => {
    const [userToken, setUserToken] = useState(false);
    // false - токен еще не загружен или его нет
    const [userId, setUserId] = useState(false);

    const [isUserReviewCreated, setUserReviewCreated] = useState(true);
    // определяет, оставлял-ли пользователь отзыв
    // используется, чтоб определить, нужна-ли кнопка "Написать отзыв"
    // по умолчанию true, чтоб не показывать кнопку раньше времени

    const [reviewsList, setReviewsList] = useState(false);

    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    
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

                    setUserId(user_data.id);

                    setProfileLoading(false);
                });
            }
        });
    }

    const getReviews = () => {
        setReviewsLoading(true);

        fetch(appConfig.apiAddress + `reviews/place/${route.params.place_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);
                        setReviewsLoading(false);
                    } catch {
                        setReviewsLoading(false);
                    }
                });
            } else {
                return res.text().then(text => {
                    let reviews_data = JSON.parse(text);
                    
                    setReviewsList(reviews_data.data);

                    setReviewsLoading(false);
                });
            }
        });
    }

    const goCreateReview = () => {
        navigation.navigate("ReviewCreation", { place_id: route.params.place_id });
    }

    const ReviewCreationButton = () => {
        return (<TouchableOpacity style={styles.reviewCreationButton} onPress={goCreateReview}>
            <Image style={styles.reviewCreationButtonIcon} source={require("../assets/images/icon_review_creation.png")} />
            <Text style={styles.reviewCreationButtonText}>Написать отзыв</Text>
        </TouchableOpacity>);
    }

    const Reviews = () => {
        if (reviewsList === false || reviewsList === null || reviewsList === undefined || reviewsLoading){
            return false;
        }

        return(
            <ScrollView style={styles.reviewsContainer}>
                {!isUserReviewCreated ? <ReviewCreationButton /> : false}

                {reviewsLoading ? <ActivityIndicator size="large" color="#fff" style={{ marginTop: "100" }} /> : reviewsList.map((review, index) => {
                    let date = review.creation_date;
                    date = date.split(" ");
                    date = date[0].split("-");
                    
                    return (<View style={styles.reviewContainer} key={index}>
                        <Text style={review.user.id == userId ? styles.reviewAuthorMe : styles.reviewAuthor}>{review.user.username}</Text>
                        <Text style={styles.reviewDate}>Оставлен {`${date[2]}.${date[1]}.${date[0]}`}г</Text>
                        <Text style={styles.reviewText}>{review.text}</Text>
                        <View style={styles.reviewRate}>
                            <Image style={styles.reviewRateIcon} source={require("../assets/images/icon_star.png")} />
                            <Text style={styles.reviewRateValue}>{review.rate}</Text>
                        </View>
                    </View>);
                })}
            </ScrollView>
        );
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
            getProfile();
            getReviews();
        }
    }, [userToken]);

    useEffect(() => {
        if(reviewsList === false || reviewsList === null || reviewsList === undefined){
            return;
        }

        let is_user_review_created = false;

        for (let i = 0; i < reviewsList.length; i++) {
            if (reviewsList[i].user.id == userId) {
                is_user_review_created = true;
                break;
            }
        }

        setUserReviewCreated(is_user_review_created);
    }, [userId, reviewsList]);

    return (
        <View style={styles.background}>
            <StatusBar />

            <Reviews />

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
    reviewCreationButton:{
        width: windowWidth - 40,
        height: 50,
        borderRadius: 12,
        backgroundColor: "#2c2c2c",
        marginBottom: 20,
        marginLeft: 20
    },
    reviewCreationButtonIcon:{
        width:36,
        height:36,
        position:"absolute",
        top:7,
        left:12
    },
    reviewCreationButtonText:{
        width:"100%",
        position:"absolute",
        top:17,
        left:0,
        fontFamily:"Formular-Medium",
        fontSize:14,
        color:"#fff",
        textAlign:"center"
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
    reviewAuthorMe:{
        fontFamily: "Formular-Medium",
        fontSize: 14,
        marginTop: 7,
        marginLeft: 9,
        color: "#A915FF"
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