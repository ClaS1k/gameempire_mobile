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

const DocsViewerScreen = ({ navigation, route }) => {
    const [docData, setDocData] = useState(false);

    const [docLoading, setDocLoading] = useState(false);

    const getDocs = () => {
        setDocLoading(true);

        fetch(appConfig.apiAddress + `places/docs/${route.params.place_id}}/${route.params.doc_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    try {
                        let error_data = JSON.parse(text);

                        setDocLoading(false);
                    } catch {
                        setDocLoading(false);
                    }
                });
            } else {
                return res.text().then(text => {
                    let doc_data = JSON.parse(text);
                    doc_data = doc_data.data;

                    setDocData(doc_data);

                    setDocLoading(false);
                });
            }
        });
    }

    const Header = () => {
        if (docData === false || docData === null || docData === undefined || docLoading) {
            return (
                <View style={styles.docHeader}>
                    <ActivityIndicator size="large" color="#fff" style={styles.docHeaderActivityIndicator} />
                </View>
            );
        }

        return (
            <View style={styles.docHeader}>
                <Image style={styles.docHeaderLogo} source={{
                    uri: docData.place.logo_file.adress
                }} />

                <Text style={styles.docHeaderTitle}>{docData.title}</Text>
            </View>
        );
    }

    const Content = () => {
        if (docData === false || docData === null || docData === undefined || docLoading) {
            return (false);
        }

        return (<ScrollView style={styles.content}>
            {docData.content.map((item, index) => {
                if (item.type == "title") {
                    return (<Text key={index} style={styles.contentTitle}>{item.text}</Text>);
                }

                if (item.type == "text") {
                    return (<Text key={index} style={styles.contentText}>{item.text}</Text>);
                }
            })}
        </ScrollView>);
    }

    const PlacesNavigation = () => {
            const goPlaceList = () => {
                navigation.navigate("PlaceSelector");
            }
    
            const goSettingsUnauth = () => {
                navigation.navigate("SettingsUnauth");
            }
    
            const logmessage = () => {
                Alert.alert("Внимание!", "Временно недоступно.");
            }
    
            return (
                <View style={navigation_styles.navigationBar}>
                    <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goPlaceList}>
                        <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_list.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={logmessage}>
                        <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_map.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goSettingsUnauth}>
                        <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_settings_highlighted.png")} />
                    </TouchableOpacity>
                </View>
            );
    }

    useEffect(() => {
        if(docData === false){
            getDocs();
        }
    }, []);

    return (
        <View style={{ backgroundColor: '#1E1E1E' }}>
            <StatusBar />
            <View style={styles.background}>
                <Header />

                <Content />

                <PlacesNavigation />
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
    docHeader: {
        width: "100%",
        height: 270,
        position: "absolute",
        top: 0,
        left: 0
    },
    docHeaderActivityIndicator: {
        marginTop: windowHeight / 2 - 40
    },
    docHeaderLogo: {
        width: 160,
        height: 160,
        objectFit: "contain",
        position: "absolute",
        left: windowWidth / 2 - 80,
        top: 60
    },
    docHeaderTitle: {
        width: windowWidth - 40,
        position: "absolute",
        top: 240,
        left: 20,
        textAlign: "center",
        fontFamily: "Formular-Bold",
        fontSize: 16,
        color: "#fff"
    },
    content: {
        width: "100%",
        height: windowHeight - 270 - 90,
        position: "absolute",
        top: 270,
        left: 0
    },
    contentTitle: {
        width: windowWidth - 40,
        marginLeft: 20,
        color: "#fff",
        fontFamily: "Formular-Medium",
        fontSize: 14,
        textAlign: "left",
        marginBottom: 8
    },
    contentText: {
        width: windowWidth - 40,
        marginLeft: 20,
        color: "#fff",
        fontFamily: "Formular",
        fontSize: 12,
        textAlign: "left",
        marginBottom: 12
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

export default DocsViewerScreen