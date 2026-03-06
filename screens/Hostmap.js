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

const HostmapScreen = ({ navigation }) => {
    const [userToken, setUserToken] = useState(false);
    // false - токен еще не загружен или его нет

    const [hostsList, setHostsList] = useState(false);
    const [hostMap, setHostMap] = useState(false);

    const [placeBackgroundPath, setPlaceBackgroundPath] = useState(false);
    
    const [hostsLoading, setHostsLoading] = useState(false);
    const [mapLoading, setMapLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [hostAuthLoading, setHostAuthLoading] = useState(false);

    const [selectedHostId, setSelectedHostId] = useState(0);
    
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

                    setPlaceBackgroundPath(user_data.place.bg_file.adress);

                    setProfileLoading(false);
                });
            }
        });
    }

    const getHosts = () => {
        setHostsLoading(true);

        fetch(appConfig.apiAddress + "hosts", {
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

                        setHostsLoading(false);
                    } catch {
                        setHostsLoading(false);
                    }
                });
            } else {
                return res.text().then(text => {
                    let hosts_data = JSON.parse(text);
                    hosts_data = hosts_data.data;

                    console.log(hosts_data[0])
                    setHostsList(hosts_data);

                    setHostsLoading(false);
                });
            }
        });
    }

    const getMap = () => {
        setMapLoading(true);

        fetch(appConfig.apiAddress + "hosts/map", {
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

                        setMapLoading(false);
                    } catch {
                        setMapLoading(false);
                    }
                });
            } else {
                return res.text().then(text => {
                    let map_data = JSON.parse(text);
                    map_data = map_data.data;

                    setHostMap(map_data);

                    setMapLoading(false);
                });
            }
        });
    }

    // вспомогательная функция для HostSelector
    // получает данные хоста по его id из hostsList
    const getHostById = (host_id) => {
        if (hostsList === false) {
            // хосты не прогружены - возвращаем false
            return false;
        }

        for (let i = 0; i < hostsList.length; i++) {
            if (hostsList[i].id == host_id) {
                return hostsList[i];
            }
        }

        return false;
    }

    const getHostnameById = (host_id) => {
        let host_data = getHostById(host_id);

        if (host_data === false) {
            return false;
        } else {
            return `(${host_data.hostgroup.name}) ${host_data.hostname}`;
        }
    }

    const getHostStatusById = (host_id) => {
        // возвращает статус хоста по его id
        // упрощена для использования в коротких выражениях
        
        let host_data = getHostById(host_id);

        if (host_data === false) {
            return false;
        } else {
            if (host_data.status == "available"){
                return true;
            }else{
                return false;
            }
        }
    }

    const HostMap = () => {
        const mapViewStyles = {
            width: windowWidth - 40,
            height: windowWidth - 40,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#2C2C2C",
            position: "absolute",
            top: 240,
            left: 20
        };
    
        const scale = (windowWidth - 40) / 400;
        // переменная хранит масштабирование карты
        // оригинальная карта 400px в ширину и имеет соотношение 1/1
        const host_item_width = 30 * scale;
        // на оригинальной карте сторона хоста занимает 30 пикселей
    
        if (hostsList === false || hostMap === false || hostsLoading || mapLoading){
            return (<View style={mapViewStyles}>
                <ActivityIndicator size="large" color="#fff" style={{
                    width: 40,
                    height: 40,
                    position: "absolute",
                    top: (((windowWidth - 40) / 4) * 3) / 2 - 30,
                    left: (windowWidth - 40) / 2 - 20
                }} />
            </View>);
        }
    
        return(<View style={mapViewStyles}>
            {hostMap.lines.map((line, lineIndex) => {
                return (<View key={`map-line-${lineIndex}`} style={{
                    width: line.type == "vertical" ? 1 : line.long * scale,
                    height: line.type == "horizontal" ? 1 : line.long * scale,
                    position: "absolute",
                    top: line.y * scale,
                    left: line.x * scale,
                    backgroundColor: "#2C2C2C"
                }}></View>
                );
            })}
    
            {hostMap.text.map((text, textIndex) => {
                return (<Text key={`map-text-${textIndex}`} style={{
                    position: "absolute",
                    top: text.y * scale,
                    left: text.x * scale,
                    color: "#ffffffbb",
                    fontFamily:"Formular",
                    fontSize:14 * scale
                }}>{text.text}</Text>
                );
            })}
    
            {hostMap.hosts.map((host, hostIndex) => {
                return (<TouchableOpacity onPress={() => { setSelectedHostId(host.id)}} key={`map-host-${hostIndex}`} style={{
                    width:host_item_width,
                    height: host_item_width,
                    position:"absolute",
                    top:host.y * scale,
                    left:host.x * scale,
                    borderRadius:4,
                    backgroundColor: selectedHostId == host.id ? "#A915FF" : (getHostStatusById(host.id) ? "#424242" : "#2c2c2c")
                }}> 
                    <Text style={{
                            width:"100%",
                            textAlign:"center",
                            verticalAlign:"center",
                            color:"#fff",
                            fontFamily:"Formular-Medium",
                            fontSize:12,
                            position:"absolute",
                            left:0,
                            top:"50%",
                            marginTop:-8
                    }}>{host.number}</Text>
                </TouchableOpacity>
            )
            ;})}
        </View>);
    }

    const HostAuthButton = () => {
        const onPress = () => {
            setHostAuthLoading(true);

            fetch(appConfig.apiAddress + `hosts/auth/${selectedHostId}`, {
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

                            console.log(error_data);
                            setHostAuthLoading(false);
                        } catch {
                            setHostAuthLoading(false);
                        }
                    });
                } else {
                    return res.text().then(text => {
                        console.log("success");
                        getHosts();

                        setHostAuthLoading(false);
                    });
                }
            });
        }

        return(
            <TouchableOpacity style={styles.hostAuthButton} onPress={onPress}>
                <Text style={styles.hostAuthButtonText}>Войти</Text>
            </TouchableOpacity>
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
            getHosts();
            getMap();
        }
    }, [userToken]);

    return (
        <View style={styles.background}>
            <StatusBar />

            <View style={styles.header}>
                {(profileLoading && placeBackgroundPath !== false) ? <ActivityIndicator size="large" color="#fff" style={{}} /> : <Image style={styles.headerBg} source={{ uri: placeBackgroundPath ? placeBackgroundPath : "" }} />}
                <View style={styles.headerMask}>
                    <Text style={styles.headerMaskText}>Карта клуба</Text>
                </View>
            </View>

            <HostMap />

            <Text style={styles.selectedHostname}>{selectedHostId == 0 ? "Выберите хост" : getHostnameById(selectedHostId)}</Text>
            {selectedHostId !== 0 ?(getHostStatusById(selectedHostId) ? <Text style={styles.selectedHostStatusAvailable}>Свободен</Text> : <Text style={styles.selectedHostStatusUnavailable}>Занят</Text>) : false}

            {getHostStatusById(selectedHostId) ? <HostAuthButton /> : false}
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
        height:200,
        position:"absolute",
        top:0,
        left:0
    },
    headerBg:{
        width:"100%",
        height:"100%",
        position: "absolute",
        top: 0,
        left: 0,
        objectFit:"cover",
        zIndex:1
    },
    headerMask:{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor:"rgba(0,0,0,.5)",
        zIndex:10
    },
    headerMaskText:{
        width:"100%",
        textAlign:"center",
        color:"#fff",
        fontFamily:"Formular-Medium",
        fontSize:20,
        position:"absolute",
        top:90,
        left:0
    },
    selectedHostname:{
        width: "100%",
        textAlign: "center",
        color: "#fff",
        fontFamily: "Formular-Medium",
        fontSize: 14,
        position: "absolute",
        left: 0,
        top: 240 + windowWidth - 40 + 20
    },
    selectedHostStatusAvailable:{
        width: "100%",
        textAlign: "center",
        color: "#00FF5E",
        fontFamily: "Formular",
        fontSize: 12,
        position: "absolute",
        left: 0,
        top: 240 + windowWidth - 40 + 20 + 25
    },
    selectedHostStatusUnavailable:{
        width: "100%",
        textAlign: "center",
        color: "#FFABAC",
        fontFamily: "Formular",
        fontSize: 12,
        position: "absolute",
        left: 0,
        top: 240 + windowWidth - 40 + 20 + 25
    },
    hostAuthButton:{
        width: windowWidth - 40,
        height: 42,
        position: "absolute",
        bottom: 90,
        left: 20,
        borderRadius: 12,
        backgroundColor: "#A915FF"
    },
    hostAuthButtonText:{
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

export default HostmapScreen