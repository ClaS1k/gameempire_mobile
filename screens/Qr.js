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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import QRCode from 'react-native-qrcode-svg';

import appConfig from "../appConfig";

const QrScreen = ({ navigation }) => {
    const [userToken, setUserToken] = useState(false);
    // false - токен еще не загружен или его нет
    const [username, setUsername] = useState(false);
    // username пользователя

    const [permission, requestPermission] = useCameraPermissions();
    // разрешения камеры
    const [scanned, setScanned] = useState(false);

    const [selectedTab, setSelectedTab] = useState("show");
    // может быть scan или show

    const [hostsList, setHostsList] = useState(false);

    const [hostsLoading, setHostsLoading] = useState(false);
    const [logIntoHostLoading, setLogIntoHostLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);

    const [scannerKey, setScannerKey] = useState(0);

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

                    setHostsList(hosts_data);

                    setHostsLoading(false);
                });
            }
        });
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

                    setProfileLoading(false);
                });
            }
        });
    }
    
    const checkPermissions = () => {
        if (!permission) {
            return false;
        }

        return permission.granted;
    }

    const resetScanner = async () => {
        setScanned(false);
        setScannerKey(scannerKey + 1);
    };

    const getHostIdByHostGizmoId = (gizmo_id) => {
        if (hostsList === false || hostsList === null || hostsList === undefined || hostsLoading){
            return false;
        }

        for(let i = 0; i < hostsList.length; i++){
            if(hostsList[i].gizmo_id == gizmo_id){
                return hostsList[i].id;
            }
        }

        return false;
    }

    const logIntoHost = (host_id) => {
        setLogIntoHostLoading(true);

        fetch(`${appConfig.apiAddress}hosts/auth/${host_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + userToken.trim()
            }
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    setLogIntoHostLoading(false);

                    alert("Ошибка входа");
                });
            }
            else {
                setLogIntoHostLoading(false);
                alert("Успешный вход!");

                return;
            }
        });
    }

    const handleBarCode = ({ data }) => {
        if (scanned) {
            return true;
        }

        try {
            let host_data = JSON.parse(data);

            if (!host_data.HostId) {
                alert(`Не корректный QR-код`);
                return;
            }

            let host = getHostIdByHostGizmoId(host_data.HostId);

            if (!host) {
                alert(`Ошибка хоста`);
                return;
            }

            logIntoHost(host);
        } catch {
            alert(`Не корректный QR-код JSON`);
        }
    };

    const PermissionsTab = () => {
        return(
            <View style={styles.permissionsTab}>
                <Image style={styles.permissionsTabIcon} source={require("../assets/images/icon_camera_permissions.png")} />
                <Text style={styles.permissionsTabText}>Приложению нужен доступ к камере устройства</Text>
                <TouchableOpacity style={styles.permissionsTabButton} onPress={requestPermission}>
                    <Text style={styles.permissionsTabButtonText}>Разрешить</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const ScanTab = () => {
        if (logIntoHostLoading) {
            return false;
        }

        return (
            <View style={styles.scanTab}>
                <View style={styles.scanTabCameraView}>
                    <CameraView
                        key={scannerKey}
                        style={styles.camera}
                        onBarcodeScanned={handleBarCode}
                        barcodeScannerSettings={{
                            barcodeTypes: ['qr'],
                        }}
                    />
                    <View style={styles.scanTabСameraScanZone} />
                </View>

                <Text style={styles.myQrTabText}>Отсканируйте QR-код на ПК</Text>
            </View>
        );
    }

    const MyQrTab = () => {
        if (username === false || username === null || username === undefined){
            // если логин не загрузился - ничего не показываем
            return false;
        }

        return (
            <View style={styles.myQrTab}>
                <View style={styles.myQrImage}>
                    <QRCode
                        size={280}
                        value={username}
                    />
                </View>
                <Text style={styles.myQrTabText}>Покажите QR-код администратору</Text>
            </View>
        );
    }

    const TabSelector = () => {
        return (
            <View style={styles.tabSelector}>
                <TouchableOpacity style={selectedTab == "scan" ? styles.tabSelectorScanSelected : styles.tabSelectorScan} onPress={() => {setSelectedTab("scan")}}>
                    <Text style={styles.tabSelectorBtnText}>Сканирование</Text>
                </TouchableOpacity>
                <TouchableOpacity style={selectedTab == "show" ? styles.tabSelectorMyQrSelected : styles.tabSelectorMyQr} onPress={() => {setSelectedTab("show")}}>
                    <Text style={styles.tabSelectorBtnText}>Мой QR</Text>
                </TouchableOpacity>
            </View>
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
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_home.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goProfile}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_profile.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={navigation_styles.navigationBarButton} onPress={goQr}>
                    <Image style={navigation_styles.navigationBarButtonIcon} source={require("../assets/images/icon_qr_highlighted.png")} />
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
        }
    }, [userToken]);

    return (
        <View style={styles.background}>
            <StatusBar />

            {selectedTab === "scan" ? (checkPermissions() === true ? <ScanTab /> : <PermissionsTab />) : <MyQrTab />}

            <TabSelector />
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
    permissionsTab:{
        width:"100%",
        height:windowHeight - 150,
        position:"absolute",
        top:0,
        left:0
    },
    permissionsTabIcon:{
        width: 160,
        height: 160,
        position:"absolute",
        top:70,
        left:(windowWidth / 2) - 80
    },
    permissionsTabText:{
        width:230,
        textAlign:"center",
        fontFamily:"Formular-Medium",
        fontSize:16,
        position: "absolute",
        top: 250,
        left: (windowWidth / 2) - 115,
        color:"#fff"
    },
    permissionsTabButton:{
        width: windowWidth - 40,
        height: 50,
        position: "absolute",
        top: 322,
        left:20,
        backgroundColor:"#2C2C2C",
        borderRadius:12
    },
    permissionsTabButtonText:{
        width:"100%",
        textAlign:"center",
        color:"#fff",
        fontFamily: 'Formular-Bold',
        fontSize: 14,
        position:"absolute",
        left:0,
        top:15
    },
    myQrTab:{
        width: "100%",
        height: windowHeight - 150,
        position: "absolute",
        top: 0,
        left: 0
    },
    myQrImage:{
        width:300,
        height:300,
        padding:10,
        backgroundColor:"#fff",
        position:"absolute",
        top:60,
        left:(windowWidth / 2) - 150,
        borderRadius:12,
        overflow:'hidden'
    },
    myQrTabText:{
        width: 230,
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 16,
        position: "absolute",
        top: 400,
        left: (windowWidth / 2) - 115,
        color: "#fff"
    },
    tabSelector:{
        width: windowWidth - 40,
        height: 50,
        backgroundColor: "#2C2C2C",
        borderRadius: 12,
        position: "absolute",
        bottom: 90,
        left: 20
    },
    tabSelectorScan:{
        width:"50%",
        height:"100%",
        position:"absolute",
        top:0,
        left:0,
        borderTopLeftRadius:12,
        borderBottomLeftRadius:12
    },
    tabSelectorScanSelected: {
        width: "50%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        backgroundColor: "#A915FF"
    },
    tabSelectorBtnText:{
        width:"100%",
        textAlign:"center",
        fontFamily: 'Formular-Bold',
        fontSize: 14,
        color: "#fff",
        position:"absolute",
        top:15
    },
    tabSelectorMyQr:{
        width: "50%",
        height: "100%",
        position: "absolute",
        top: 0,
        right: 0,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12
    },
    tabSelectorMyQrSelected: {
        width: "50%",
        height: "100%",
        position: "absolute",
        top: 0,
        right: 0,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        backgroundColor: "#A915FF"
    },
    scanTab: {
        width: "100%",
        height: 560,
        position: "absolute",
        top: 0,
        left: 0,
    },
    scanTabCameraView: {
        width: 280,
        height: 280,
        borderRadius: 12,
        position: "absolute",
        top: 70,
        left: "50%",
        marginLeft: -140
    },
    camera: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        borderRadius: 12
    },
    scanTabСameraScanZone: {
        width: 180,
        height: 180,
        borderWidth: 1,
        borderColor: "#FFF",
        borderRadius: 8,
        position: "absolute",
        top: 50,
        left: 50
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

export default QrScreen