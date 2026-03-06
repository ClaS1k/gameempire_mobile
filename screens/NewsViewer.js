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

const NewsViewerScreen = ({ navigation, route }) => {
    const [userToken, setUserToken] = useState(false);
    
    const [newsData, setNewsData] = useState(false);
        
    const [newsLoading, setNewsLoading] = useState(false);
    const [bonuseLoading, setBonuseLoading] = useState(false);

    const getNews = () => {
        setNewsLoading(true);

        fetch(appConfig.apiAddress + `news/byid/${route.params.news_id}`, {
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
                        setNewsLoading(false);
                    } catch {
                        setNewsLoading(false);
                    }
                });
            } else {
                return res.text().then(text => {
                    let news_data = JSON.parse(text);

                    setNewsData(news_data.data);

                    setNewsLoading(false);
                });
            }
        });
    }

    const getBonuse = () => {
        setBonuseLoading(true);

        fetch(appConfig.apiAddress + `news/bonuse/${route.params.news_id}`, {
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
                        Alert.alert("Ошибка!", error_data.message);

                        setBonuseLoading(false);
                    } catch {
                        Alert.alert("Ошибка!", "Бонус не зачислен");
                        setBonuseLoading(false);
                    }
                });
            } else {
                Alert.alert("Успешно!", "Бонус получен");
                setBonuseLoading(false);
            }
        });
    }

    const Header = () => {
        if (newsData === false || newsData === null || newsData === undefined || newsLoading){
            // Заголовок с индикатором загрузки
            return (<View style={styles.headerContainer}>
                <ActivityIndicator size="large" color="#fff" style={{ marginTop: windowHeight/2 - 40 }} />
            </View>); 
        }

        let date = newsData.creation_date;
        date = date.split(" ");

        date = date[0].split("-");

        // обычный заголовок
        return (<View style={styles.headerContainer}>
            <Image style={styles.headerContainerWallpaper} source={{
                uri: newsData.wallpaper_file.adress
            }} />
            <View style={styles.headerContainerMask}>
                <TouchableOpacity onPress={() => {navigation.navigate("News")}} style={styles.headerContainerMaskGoBack}><Text style={styles.headerContainerMaskGoBackText}>К новостям</Text></TouchableOpacity>
                <Text style={styles.headerContainerMaskDate}>{date[2]}.{date[1]}</Text>
                <Text style={styles.headerContainerMaskTitle}>{newsData.title}</Text>
                <Text style={styles.headerContainerMaskSubtitle}>{newsData.subtitle}</Text>
            </View>
        </View>);
    }

    const Content = () => {
        if (newsData === false || newsData === null || newsData === undefined || newsLoading) {
            return false;
        }

        const contentStyles = {
            width:"100%",
            height: newsData.bonuse == 0 ? windowHeight - 220 - 90 : windowHeight - 220 - 90 - 60,
            position:"absolute",
            top:220,
            left:0,
            paddingTop:10
        };

        return(<ScrollView style={contentStyles}>
            <Text style={styles.contentText}>{newsData.text}</Text>
        </ScrollView>);
    }

    const BonuseButton = () => {
        if (newsData === false || newsData === null || newsData === undefined || newsLoading) {
            return false;
        }

        if (newsData.bonuse == "0"){
            // бонус не предусмотрен
            return;
        }

        return(<TouchableOpacity onPress={getBonuse} style={styles.bonuseButton}>
            <Text style={styles.bonuseButtonText}>Получить бонус</Text>
        </TouchableOpacity>);
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
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_news_highlighted.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goSettings}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_settings.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goHome}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_home.png")} />
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
            getNews();
        }
    }, [userToken]);

    return (
        <View style={{ backgroundColor: '#1E1E1E' }}>
            <StatusBar />
            <View style={styles.background}>
                <Header />
                <Content />

                <BonuseButton />
                <Navigation />
            </View>
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
    headerContainer:{
        width:"100%",
        height:220,
        position:"absolute",
        top:0,
        left:0
    },
    headerContainerWallpaper:{
        width:"100%",
        height:"100%",
        position:"absolute",
        top:0,
        left:0,
        zIndex:1,
        objectFit:"cover"
    },
    headerContainerMask:{
        width:"100%",
        height:"100%",
        position:"absolute",
        top:0,
        left:0,
        backgroundColor:"rgba(16, 16, 16, .6)",
        zIndex:100
    },
    headerContainerMaskGoBack:{
        width:140,
        height:20,
        position:"absolute",
        top:40,
        left:20
    },
    headerContainerMaskGoBackText:{
        fontFamily: "Formular-Medium",
        fontSize: 12,
        color: "#fff"
    },
    headerContainerMaskDate:{
        fontFamily:"Formular-Medium",
        fontSize:12,
        color:"#fff",
        position:"absolute",
        top:40,
        right:20
    },
    headerContainerMaskTitle:{
        width:windowWidth - 40,
        position:"absolute",
        left:20,
        top:150,
        color:"#fff",
        fontFamily:"Formular-Medium",
        fontSize:14,
        textAlign:"center"
    },
    headerContainerMaskSubtitle:{
        width: windowWidth - 40,
        position: "absolute",
        left: 20,
        top: 180,
        color: "rgba(255, 255, 255, .8)",
        fontFamily: "Formular-Medium",
        fontSize: 12,
        textAlign: "center"
    },
    contentText:{
        width:windowWidth - 40,
        position:"absolute",
        top:0,
        left:20,
        fontFamily:'Formular',
        fontSize:14,
        color:"#fff",
        textAlign:"left"
    },
    bonuseButton: {
        width: windowWidth - 40,
        height: 42,
        position: "absolute",
        bottom: 90,
        left: 20,
        borderRadius: 12,
        backgroundColor: "#A915FF"
    },
    bonuseButtonText: {
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

export default NewsViewerScreen