import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    SafeAreaView,
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

const ReviewsUnauthScreen = ({ navigation, route }) => {
    const [reviewsList, setReviewsList] = useState(false);

    const [reviewsLoading, setReviewsLoading] = useState(false);

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

    const goBack = () => {
        navigation.navigate("SignIn", { place_id : route.params.place_id});
    }

    const Reviews = () => {
        if (reviewsList === false || reviewsList === null || reviewsList === undefined || reviewsLoading){
            return false;
        }

        return(
            <ScrollView style={styles.reviewsContainer}>
                {reviewsLoading ? <ActivityIndicator size="large" color="#fff" style={{ marginTop: "100" }} /> : reviewsList.map((review, index) => {
                    let date = review.creation_date;
                    date = date.split(" ");
                    date = date[0].split("-");
                    
                    return (<View style={styles.reviewContainer} key={index}>
                        <Text style={styles.reviewAuthor}>{review.user.username}</Text>
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

    const BackButton = () => {
        return (
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Text style={styles.backButtonText}>Вернуться</Text>
            </TouchableOpacity>
        );
    }

    useEffect(() => {
        if ((reviewsList === false || reviewsList === null || reviewsList === undefined) && !reviewsLoading) {
            getReviews();
        }
    }, []);

    return (
        <View style={styles.background}>
            <StatusBar />

            <Reviews />

            <BackButton />
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
    reviewsContainer:{
        width:"100%",
        height: windowHeight - 90,
        position:"absolute",
        paddingTop:50,
        top:0,
        left:0
    },
    reviewContainer:{
        width: windowWidth - 40,
        height: "auto",
        borderRadius:12,
        backgroundColor:"#2c2c2c",
        marginBottom:20,
        marginLeft:20
    },
    reviewAuthor:{
        fontFamily:"Formular-Medium",
        fontSize:14,
        marginTop:7,
        marginLeft:9,
        color:"#fff"
    },
    reviewDate:{
        fontFamily: "Formular-Medium",
        fontSize: 12,
        marginTop: 5,
        marginLeft: 9,
        color: "rgba(255, 255, 255, .7)"
    },
    reviewText:{
        width:windowWidth - 40 - 18,
        fontFamily: "Formular-Medium",
        fontSize: 12,
        marginTop: 7,
        marginLeft: 9,
        color: "#fff",
        marginBottom:9
    },
    reviewRate:{
        width:25,
        height:15,
        position:"absolute",
        top:7,
        right:9
    },
    reviewRateIcon:{
        width:14,
        height:14,
        position:"absolute",
        right:0,
        top:1
    },
    reviewRateValue:{
        fontFamily: "Formular-Medium",
        fontSize: 12,
        color: "#fff",
    },
    backButton:{
        width: windowWidth - 50,
        height: 50,
        backgroundColor: "#2C2C2C",
        borderRadius: 12,
        position: "absolute",
        bottom: 25,
        left: 25
    },
    backButtonText:{
        width: "100%",
        fontFamily: 'Formular-Bold',
        fontSize: 18,
        position: "absolute",
        top: 14,
        left: 0,
        color: "#fff",
        textAlign: "center"
    }
});

export default ReviewsUnauthScreen