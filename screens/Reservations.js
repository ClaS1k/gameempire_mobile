import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Text,
    View,
    FlatList,
    StatusBar,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Dimensions,
    Alert,
    Modal
} from 'react-native';

import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

import appConfig from "../appConfig";

const ReservationsScreen = ({ navigation }) => {
    const [userToken, setUserToken] = useState(false);
    // false - токен еще не загружен или его нет
    const [notificationTitle, setNotificationTitle] = useState("Внимание!");
    const [notificationText, setNotificationText] = useState("Сервисное сообщение.");

    const [hostsList, setHostsList] = useState(false);
    const [hostMap, setHostMap] = useState(false);
    const [productOptions, setProductOptions] = useState(false);

    const [hostsLoading, setHostsLoading] = useState(false);
    const [mapLoading, setMapLoading] = useState(false);
    const [productOptionsLoading, setProductOptionsLoading] = useState(false);
    const [createReservationLoading, setCreateReservationLoading] = useState(false);

    const [reservationStep, setReservationStep] = useState("date");
    // шаг бронирования
    // date, host или verification

    const [monthSelected, setMonthSelected] = useState(false);
    // false - ничего не выбрано
    // current - выбран текущий месяц
    // next - выбран следующий месяц
    const [dateSelected, setDateSelected] = useState(false);
    // false - дата не выбрана
    // число n - выбранная дата

    const [timesList, setTimesList] = useState([]);
    // список вариантов времени бронирования
    const timesRef = useRef(null);
    // ссылка на FlatList с временем бронирования
    
    const [selectedTime, setSelectedTime] = useState("12:00");

    const [selectedHostId, setSelectedHostId] = useState(0);
    const [selectedProductOption, setSelectedProductOption] = useState(false);
    // содержит индекс выбранного пакетного предложения
    // или false, если оно не выбрано

    const [notificationVisible, setNotificationVisible] = useState(false);

    const modalPropsNotification = useMemo(() => ({
        animationType: "slide",
        transparent: true,
        visible: notificationVisible,
        onRequestClose: () => setNotificationVisible(false),
    }), [notificationVisible]);

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

    const getProductOptions = () => {
        setProductOptionsLoading(true);

        fetch(appConfig.apiAddress + `reservations/products/${selectedHostId}`, {
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

                        setProductOptionsLoading(false);
                    } catch {
                        setProductOptionsLoading(false);
                    }
                });
            } else {
                return res.text().then(text => {
                    let options_data = JSON.parse(text);
                    options_data = options_data.data;

                    setProductOptions(options_data);

                    setProductOptionsLoading(false);
                });
            }
        });
    }

    const createReservation = (payment_method) => {
        const today = new Date();

        let date = `${monthSelected == "next" ? (today.getMonth() == 11 ? today.getFullYear() + 1 : today.getFullYear()) : today.getFullYear()}-${monthSelected == "next" ? (today.getMonth() == 11 ? "01" : (today.getMonth() + 2 < 10 ? `0${today.getMonth() + 2}` : today.getMonth() + 2)) : (today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1)}-${dateSelected < 10 ? `0${dateSelected}` : dateSelected}T${selectedTime}:00`;
        
        setCreateReservationLoading(true);

        let body = {
            "host_id": selectedHostId,
            "date": date,
            "product_option": selectedProductOption,
            "payment_method": payment_method
        }

        let xhr = new XMLHttpRequest();
        let adress = encodeURI(appConfig.apiAddress + "reservations/create");
        xhr.open('POST', adress, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer ' + userToken);  
        xhr.send(JSON.stringify(body));
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    navigation.navigate("Home");
                } else {
                    try {
                        let response = JSON.parse(xhr.responseText);

                        showNotificationPopup("Ошибка!", response.message);
                    } catch {
                        showNotificationPopup("Ошибка!", "Неизвестная ошибка");
                    }
                }

                setCreateReservationLoading(false);
            }
        }
    }
    
    const selectDate = (date, isCurrentMonth) => {
        setDateSelected(date);
        setMonthSelected(isCurrentMonth ? "current" : "next");
    }

    const getMonthInfo = () => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth(); // 0-11 (0 - январь)

        // Названия месяцев на русском
        const monthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];

        // Текущий месяц
        const currentMonthName = monthNames[currentMonth];

        // Следующий месяц (с учетом перехода на следующий год)
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextMonthName = monthNames[nextMonth];

        // Количество дней в текущем месяце
        const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Количество дней в следующем месяце
        // Определяем год для следующего месяца
        const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        const daysInNextMonth = new Date(nextMonthYear, nextMonth + 1, 0).getDate();

        // Порядковый номер дня недели для 1 числа текущего месяца
        // getDay() возвращает 0 для воскресенья, 1 для понедельника, ..., 6 для субботы
        let firstDayOfCurrentMonth = new Date(currentYear, currentMonth, 1).getDay();

        // Порядковый номер дня недели для 1 числа следующего месяца
        let firstDayOfNextMonth = new Date(nextMonthYear, nextMonth, 1).getDay();

        if (firstDayOfCurrentMonth == 0){
            firstDayOfCurrentMonth = 6;
        }else{
            firstDayOfCurrentMonth -= 1;
        }
        // преобразуем так, чтоб 0 - понедельник, а 6 - воскресенье

        if (firstDayOfNextMonth == 0) {
            firstDayOfNextMonth = 6;
        } else {
            firstDayOfNextMonth -= 1;
        }
        // преобразуем так, чтоб 0 - понедельник, а 6 - воскресенье

        return {
            currentMonth: currentMonthName,
            nextMonth: nextMonthName,
            daysInCurrentMonth: daysInCurrentMonth,
            daysInNextMonth: daysInNextMonth,
            currentYear: currentYear,
            nextYear: currentMonth == 11 ? currentYear + 1 : currentYear,
            firstDayOfCurrentMonth: firstDayOfCurrentMonth,
            firstDayOfNextMonth: firstDayOfNextMonth
        };
    }

    const Header = () => {
        return(
            <View style={styles.header}>
                <Text style={styles.headerText}>Добавление брони</Text>
    
                <TouchableOpacity style={styles.headerButton}>
                    <Image style={styles.headerButtonIcon} source={require("../assets/images/icon_info.png")} />
                </TouchableOpacity>
            </View>
        );
    }

    // Функция для генерации дней месяца
    // вспомогательная функция для DateSelector
    const generateMonthDays = (firstDay, daysInMonth, isCurrentMonth) => {
        const days = [];

        // Корректировка: в JS воскресенье = 0, а нам нужно ПН = 0
        // Преобразуем: если firstDay = 0 (вс), то это 6 позиция (после ПН-СБ)
        const startOffset = firstDay === 0 ? 6 : firstDay - 1;

        // Добавляем пустые ячейки для выравнивания
        for (let i = 0; i < startOffset; i++) {
            days.push(
                <View key={`empty-${i}`} style={styles.dateLineItem}>
                    {/* Пустой View */}
                </View>
            );
        }

        let renderMonthSelected = monthSelected == "current" ? true : false;

        // Добавляем дни месяца
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(
                <View key={`day-${day}`} style={styles.dateLineItem}>
                    <TouchableOpacity style={styles.dateLineItemTouchable} onPress={() => { selectDate(day, isCurrentMonth)}}>
                        {(day == dateSelected && renderMonthSelected == isCurrentMonth) ? <Text style={styles.dateLineItemTextSelected}>{day}</Text> : <Text style={styles.dateLineItemText}>{day}</Text>}
                    </TouchableOpacity>
                </View>
            );
        }

        return days;
    };

    // Функция для разбиения дней на недели
    // вспомогательная функция для DateSelector
    const chunkIntoWeeks = (days) => {
        const weeks = [];
        const totalDays = days.length;
        const totalWeeks = Math.ceil(totalDays / 7);

        for (let week = 0; week < totalWeeks; week++) {
            const start = week * 7;
            const end = Math.min(start + 7, totalDays);
            const weekDays = days.slice(start, end);

            // Если последняя неделя неполная, добавляем пустые ячейки
            while (weekDays.length < 7) {
                weekDays.push(
                    <View key={`empty-week-${week}-${weekDays.length}`} style={styles.dateLineItem}>
                        {/* Пустой View */}
                    </View>
                );
            }

            weeks.push(weekDays);
        }

        return weeks;
    };

    const DateSelector = () => {
        const monthInfo = getMonthInfo();

        // Генерируем дни для текущего месяца
        const currentMonthDays = generateMonthDays(
            monthInfo.firstDayOfCurrentMonth,
            monthInfo.daysInCurrentMonth,
            true
        );
        const currentMonthWeeks = chunkIntoWeeks(currentMonthDays);

        // Генерируем дни для следующего месяца
        const nextMonthDays = generateMonthDays(
            monthInfo.firstDayOfNextMonth,
            monthInfo.daysInNextMonth,
            false
        );
        const nextMonthWeeks = chunkIntoWeeks(nextMonthDays);

        return (
            <View style={styles.dateSelector}>
                <Text style={styles.dateSelectorTitle}>Выберите дату</Text>

                {/* Заголовки дней недели (ПН-ВС) */}
                <View style={styles.dateLine}>
                    {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map((day, index) => (
                        <View key={`header-${index}`} style={styles.dateLineItem}>
                            <Text style={styles.dateLineItemText}>{day}</Text>
                        </View>
                    ))}
                </View>

                {/* Текущий месяц */}
                <Text style={styles.monthLine}>
                    {monthInfo.currentMonth} {monthInfo.currentYear}
                </Text>

                {/* Дни текущего месяца */}
                {currentMonthWeeks.map((week, weekIndex) => (
                    <View key={`current-week-${weekIndex}`} style={styles.dateLine}>
                        {week}
                    </View>
                ))}

                {/* Следующий месяц */}
                <Text style={styles.monthLine}>
                    {monthInfo.nextMonth} {monthInfo.nextYear}
                </Text>

                {/* Дни следующего месяца */}
                {nextMonthWeeks.map((week, weekIndex) => (
                    <View key={`next-week-${weekIndex}`} style={styles.dateLine}>
                        {week}
                    </View>
                ))}
            </View>
        );
    };

    // вспомогательная функция для HostSelector
    // устанавливает в timesList массив вариантов времени для бронирования
    // в формате "ЧЧ:ММ" 
    const createTimesList = () => {
        let local_times_list = [];

        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {

                let display_hour;
                let display_minute;

                if (hour < 10) {
                    display_hour = "0" + hour;
                } else {
                    display_hour = hour;
                }

                if (minute < 10) {
                    display_minute = "0" + minute;
                } else {
                    display_minute = minute;
                }

                let display_time = display_hour + ":" + display_minute;

                local_times_list.push(display_time);
            }
        }

        setTimesList(local_times_list);
    }

    // вспомогательная функция для HostSelector
    // получает данные хоста по его id из hostsList
    const getHostById = (host_id) => {
        if (hostsList === false){
            // хосты не прогружены - возвращаем false
            return false;
        }

        for(let i=0; i<hostsList.length; i++){
            if (hostsList[i].id == host_id){
                return hostsList[i];
            }
        }

        return false;
    }

    const getHostnameById = (host_id) => {
        let host_data = getHostById(host_id);

        if (host_data === false){
            return false;
        }else{
            return `(${host_data.hostgroup.name}) ${host_data.hostname}`;
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
            top: 150,
            left: 0
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
                    backgroundColor: selectedHostId == host.id ? "#A915FF" : "#2C2C2C"
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
            );})}
        </View>);
    }

    const HostSelector = () => {
        return(
            <View style={styles.hostSelector}>
                <View style={styles.hostSelectorTimeSelector}>
                    <Text style={styles.hostSelectorTimeSelectorTitle}>Выберите время</Text>

                    <View style={styles.hostSelectorTimeSelectorContainer}>
                        <FlatList
                            horizontal={true}
                            data={timesList}
                            ref={timesRef}
                            initialNumToRender={50}
                            keyExtractor={item => item}
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={74}
                            animated={false}
                            contentContainerStyle={{
                                paddingHorizontal: (windowWidth - 74) / 2
                            }}
                            onMomentumScrollEnd={ev => {
                                const index = Math.round(ev.nativeEvent.contentOffset.x / 74);
                                setSelectedTime(timesList[index]);
                            }}
                            decelerationRate="fast"
                            renderItem={({item, index}) =>{
                                if(selectedTime == item){
                                    return (<TouchableOpacity
                                        key={index}
                                        style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: 45,
                                            backgroundColor: '#A915FF',
                                            marginLeft: 7,
                                            marginRight: 7
                                        }}>
                                        <Text style={{
                                            fontFamily: 'Formular-Bold',
                                            fontSize: 14,
                                            textAlign: 'center',
                                            marginTop: 20,
                                            color: '#fff'
                                        }}>{item}</Text>
                                    </TouchableOpacity>);
                                }else{
                                    return (<TouchableOpacity
                                        onPress={() => { 
                                            setSelectedTime(item);
                                        }}
                                        key={index}
                                        style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: 45,
                                            backgroundColor: '#2C2C2C',
                                            marginLeft: 7,
                                            marginRight: 7
                                        }}>
                                        <Text style={{
                                            fontFamily: 'Formular-Bold',
                                            fontSize: 14,
                                            textAlign: 'center',
                                            marginTop: 20,
                                            color: '#fff'
                                        }}>{item}</Text>
                                    </TouchableOpacity>);
                                }
                            }}></FlatList>
                    </View>
                    
                    <Text style={styles.HostMapTitle}>Выберите ПК</Text>
                    <HostMap />

                    {selectedHostId == 0 ? false : <Text style={styles.hostSelectorSelectedHostname}>{getHostnameById(selectedHostId)}</Text>}
                </View>
                <HostMap />
            </View>
        );
    }

    const ProductSelector = () => {
        if (productOptionsLoading || productOptions === false || productOptions === null || productOptions === undefined){
            return (
                <View style={styles.reservationVerificationProductSelector}>
                    <Text style={styles.reservationVerificationProductSelectorTitle}>Выберите пакет</Text>

                    <ActivityIndicator size="large" color="#fff" style={{
                        width: 40,
                        height: 40,
                        position: "absolute",
                        top: 50,
                        left: (windowWidth - 40) / 2 - 10
                    }} />
                </View>
            );
        }

        return(
            <View style={styles.reservationVerificationProductSelector}>
                <Text style={styles.reservationVerificationProductSelectorTitle}>Выберите пакет</Text>

                <View style={styles.reservationVerificationProductSelectorContainer}>
                    {productOptions.map((option, index) => {
                        return (<TouchableOpacity onPress={() => setSelectedProductOption(index)} key={index} style={index === selectedProductOption ? styles.reservationVerificationProductSelectorItemSelected : styles.reservationVerificationProductSelectorItem}>
                            <Text style={styles.reservationVerificationProductSelectorItemName}>{option.name}</Text>
                            <Text style={styles.reservationVerificationProductSelectorItemCost}>{option.cost} ₽</Text>
                        </TouchableOpacity>);
                    })}
                </View>
            </View>
        );
    }

    const ReservationVerification = () => {
        const today = new Date();
        const host_data = getHostById(selectedHostId);

        let display_date = `${dateSelected < 10 ? `0${dateSelected}` : dateSelected}.${monthSelected == "next" ? (today.getMonth() == 11 ? "01" : (today.getMonth() + 2 < 10 ? `0${today.getMonth() + 2}` : today.getMonth() + 2)) : (today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1)}.${monthSelected == "next" ? (today.getMonth() == 11 ? today.getFullYear() + 1 : today.getFullYear()) : today.getFullYear()} ${selectedTime}`;
        let display_host = `${host_data.hostgroup.name}, ${host_data.hostname}`;
        
        return(
            <View style={styles.reservationVerification}>
                <View style={styles.reservationVerificationPrimaryDate}>
                    <Image style={styles.reservationVerificationPrimaryDateIcon} source={require("../assets/images/icon_calendar.png")} />
                    <Text style={styles.reservationVerificationPrimaryDateText}>{display_date}</Text>
                </View>
                <View style={styles.reservationVerificationPrimaryHost}>
                    <Image style={styles.reservationVerificationPrimaryHostIcon} source={require("../assets/images/icon_host_big.png")} />
                    <Text style={styles.reservationVerificationPrimaryHostText}>{display_host}</Text>
                </View>

                <TouchableOpacity style={styles.reservationVerificationChangeButton} onPress={() => setReservationStep("date")}>
                    <Text style={styles.reservationVerificationChangeButtonText}>Изменить параметры</Text>
                </TouchableOpacity>

                <ProductSelector />
                
                {(selectedProductOption === false || createReservationLoading) ? false : <TouchableOpacity onPress={() => { createReservation(0) }} style={styles.reservationVerificationPayMoney}>
                    <Text style={styles.reservationVerificationPayMoneyText}>{productOptions[selectedProductOption].cost} ₽</Text>
                </TouchableOpacity>}

                {(selectedProductOption === false || createReservationLoading) ? false : <TouchableOpacity onPress={() => { createReservation(1) }} style={styles.reservationVerificationPayPoints}>
                    <Text style={styles.reservationVerificationPayPointsText}>{productOptions[selectedProductOption].cost} б</Text>
                </TouchableOpacity>}

                {createReservationLoading ? <ActivityIndicator size="small" color="#fff" style={{marginTop:windowHeight - 250}} /> : false}
                
                {/* TODO индикатор загрусзки создания брони */}
            </View>
        );
    } 

    const NextStepBtn = () => {
        if(reservationStep == "date" && dateSelected === false){
            return;
        }

        if (reservationStep == "host" && selectedHostId == 0) {
            return;
        }

        if (reservationStep == "verification") {
            // на этом этапе вместо кнопки "продолжить"
            // показываем кнопки оплаты
            return;
        }

        const onPress = () => {
            if (reservationStep == "date"){
                if (monthSelected === false || dateSelected === false){
                    Alert.alert("Внимание!", "Выберите дату")
                }else{
                    setReservationStep("host");
                }
            }

            if (reservationStep == "host") {
                if (selectedHostId == 0) {
                    Alert.alert("Внимание!", "Выберите хост")
                } else {
                    getProductOptions();
                    setReservationStep("verification");
                }
            }
        }

        return(
            <TouchableOpacity style={styles.nextStepButton} onPress={onPress}>
                <Text style={styles.nextStepButtonText}>Продолжить</Text>
            </TouchableOpacity>
        );
    }

    const showNotificationPopup = (title, text) => {
        setNotificationTitle(title);
        setNotificationText(text);

        setNotificationVisible(true);
    }

    const NotificationPopup = () => {
        let touchY;

        return (
            <Modal {...modalPropsNotification}>
                <View style={styles.popupView}
                    onTouchStart={e => touchY = e.nativeEvent.pageY}
                    onTouchEnd={e => {
                        if (touchY - e.nativeEvent.pageY < -50) {
                            setNotificationVisible(false);
                        }
                    }}>
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
        createTimesList();
        // дергается тут, так как токен не меняется

        if (userToken !== false && userToken !== null) {
            getHosts();
            getMap();
        }
    }, [userToken]);

    useEffect(() => {
        if (reservationStep == "host"){
            timesRef.current.scrollToOffset({offset: timesList.indexOf(selectedTime) * 74, animated: false});
        }   
    }, [selectedTime, reservationStep, selectedHostId]);

    return (
        <View style={styles.background}>
            <StatusBar />

            <Header />

            {reservationStep == "date" ? <DateSelector /> : false}
            {reservationStep == "host" ? <HostSelector /> : false}
            {reservationStep == "verification" ? <ReservationVerification /> : false}

            <NextStepBtn />

            <Navigation />

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
        backgroundColor: '#1E1E1E'
    },
    header: {
        width: "100%",
        height: 22,
        position: "absolute",
        top: 50,
        left: 0
    },
    headerText: {
        width: windowWidth - 18,
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 18,
        color: "#fff"
    },
    headerButton: {
        width: 18,
        height: 18,
        position: "absolute",
        left: (windowWidth / 2) + 85,
        top: 4
    },
    headerButtonIcon: {
        width: 18,
        height: 18,
        position: "absolute",
        top: 0,
        left: 0
    },
    reservationVerification:{
        width: windowWidth - 40,
        height: windowHeight - 90 - 90,
        position: "absolute",
        top: 90,
        left: 20
    },
    reservationVerificationPrimaryDate: {
        width: (windowWidth - 60) / 2,
        height: (windowWidth - 60) / 2,
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#2c2c2c",
        borderRadius: 12
    },
    reservationVerificationPrimaryDateIcon: {
        width: (windowWidth - 220) / 2,
        height: (windowWidth - 220) / 2,
        objectFit: "contain",
        position: "absolute",
        top: 20,
        left: (((windowWidth - 60) / 2) / 2) - ((windowWidth - 220) / 4)
    },
    reservationVerificationPrimaryDateText: {
        width: "100%",
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 14,
        color: "#fff",
        position: "absolute",
        bottom: 20,
        left: 0
    },
    reservationVerificationPrimaryHost: {
        width: (windowWidth - 60) / 2,
        height: (windowWidth - 60) / 2,
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#2c2c2c",
        borderRadius: 12
    },
    reservationVerificationPrimaryHostIcon: {
        width: (windowWidth - 220) / 2,
        height: (windowWidth - 220) / 2,
        objectFit: "contain",
        position: "absolute",
        top: 20,
        left: (((windowWidth - 60) / 2) / 2) - ((windowWidth - 220) / 4)
    },
    reservationVerificationPrimaryHostText: {
        width: "100%",
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 14,
        color: "#fff",
        position: "absolute",
        bottom: 20,
        left: 0
    },
    reservationVerificationChangeButton: {
        width: windowWidth - 40,
        height: 42,
        position: "absolute",
        left: 0,
        top: ((windowWidth - 60) / 2) + 20,
        borderRadius: 12,
        backgroundColor: "#2C2C2C"
    },
    reservationVerificationChangeButtonText: {
        width: "100%",
        textAlign: "center",
        fontFamily: "Formular-Medium",
        color: "#fff",
        fontSize: 16,
        position: "absolute",
        top: 10,
        left: 0
    },
    reservationVerificationProductSelector:{
        width:"100%",
        height:80,
        position:"absolute",
        top: ((windowWidth - 60) / 2) + 20 + 42 + 20,
        left:0
    },
    reservationVerificationProductSelectorTitle:{
        width:"100%",
        textAlign:"center",
        position:"absolute",
        top:0,
        left:0,
        color:"#fff",
        fontFamily:"Formular-Medium",
        fontSize:16
    },
    reservationVerificationProductSelectorContainer:{
        width:"100%",
        height:45,
        position:"absolute",
        left:0,
        bottom:0,
        display:"flex",
        flexDirection:"row"
    },
    reservationVerificationProductSelectorItem:{
        width:((windowWidth - 40) - 20 - 20) / 3,
        height:45,
        display:"flex",
        marginTop: 0,
        marginRight:20,
        backgroundColor:"#2C2C2C",
        borderRadius:12
    },
    reservationVerificationProductSelectorItemSelected:{
        width: ((windowWidth - 40) - 20 - 20) / 3,
        height: 45,
        display: "flex",
        marginTop: 0,
        marginRight: 20,
        backgroundColor: "#A915FF",
        borderRadius: 12
    },
    reservationVerificationProductSelectorItemName:{
        width: "100%",
        textAlign: "center",
        position: "absolute",
        top: 2,
        left: 0,
        color: "#fff",
        fontFamily: "Formular-Bold",
        fontSize: 16
    },
    reservationVerificationProductSelectorItemCost:{
        width: "100%",
        textAlign: "center",
        position: "absolute",
        bottom: 4,
        left: 0,
        color: "#fff",
        fontFamily: "Formular-Medium",
        fontSize: 12
    },
    reservationVerificationPayMoney:{
        width:"100%",
        height:50,
        backgroundColor:"#A915FF",
        borderRadius:12,
        position:"absolute",
        bottom:65,
        left:0
    },
    reservationVerificationPayMoneyText:{
        width: "100%",
        textAlign: "center",
        position: "absolute",
        top: 14,
        left: 0,
        color: "#fff",
        fontFamily: "Formular-Bold",
        fontSize:16
    },
    reservationVerificationPayPoints:{
        width: "100%",
        height: 50,
        backgroundColor: "#2C2C2C",
        borderRadius: 12,
        position: "absolute",
        bottom: 0,
        left: 0
    },
    reservationVerificationPayPointsText:{
        width: "100%",
        textAlign: "center",
        position: "absolute",
        top: 14,
        left: 0,
        color: "#fff",
        fontFamily: "Formular-Bold",
        fontSize: 16
    },
    hostSelector:{
        width: windowWidth - 40,
        height: windowHeight - 90 - 90 - 52,
        position: "absolute",
        top: 90,
        left: 20
    },
    hostSelectorTimeSelector:{
        width:"100%",
        height:93,
        position:"absolute",
        top:0,
        left:0
    },
    hostSelectorTimeSelectorTitle:{
        width:"100%",
        position:"absolute",
        top:0,
        left:0,
        textAlign:"center",
        fontFamily:"Formular-Medium",
        fontSize:14,
        color:"#fff"
    },
    hostSelectorTimeSelectorContainer:{
        width:windowWidth,
        height:60,
        position:"absolute",
        left:-20,
        top:35
    },
    dateSelector:{
        width:windowWidth - 40,
        height:"auto",
        position:"absolute",
        top:90,
        left:20
    },
    dateSelectorTitle:{
        width:"100%",
        textAlign:"center",
        color:"#fff",
        fontFamily:"Formular-Medium",
        fontSize:14
    },
    HostMapTitle: {
        width: "100%",
        textAlign: "center",
        color: "#fff",
        fontFamily: "Formular-Medium",
        fontSize: 14,
        position:"absolute",
        left:0,
        top:110
    },
    hostSelectorSelectedHostname:{
        width: "100%",
        textAlign: "center",
        color: "#fff",
        fontFamily: "Formular-Medium",
        fontSize: 14,
        position:"absolute",
        left:0,
        top: 150 + windowWidth - 40 + 30
    },
    dateLine:{  
        width:"100%",
        height:17,
        marginTop:20,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-evenly"
    },
    dateLineItem:{
        width:36,
        height:17,
    },
    dateLineItemTouchable:{
        width:"100%",
        height:"100%",
        position:"absolute",
        top:0,
        left:0
    },
    dateLineItemText:{
        width:"100%",
        textAlign:"center",
        color:"#fff",
        fontFamily:"Formular-Medium",
        fontSize:14,
        marginTop:2
    },
    dateLineItemTextSelected: {
        width: "100%",
        textAlign: "center",
        color: "#A915FF",
        fontFamily: "Formular-Bold",
        fontSize: 14,
        marginTop: 2
    },
    monthLine:{
        width:"100%",
        fontFamily:"Formular-Medium",
        textAlign:"center",
        color:"#fff",
        fontSize:16,
        marginTop:20
    },
    nextStepButton:{
        width: windowWidth - 40,
        height: 42,
        position: "absolute",
        bottom: 90,
        left: 20,
        borderRadius: 12,
        backgroundColor: "#A915FF"
    },
    nextStepButtonText:{
        width: "100%",
        fontFamily: "Formular-Bold",
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
        position: 'absolute',
        top: 10,
        left: 0
    },
    popupView: {
        width: "100%",
        height: windowHeight - 200,
        position: "absolute",
        bottom: 0,
        left: 0,
        backgroundColor: "#2C2C2C",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12
    },
    popupViewTitle: {
        width: "100%",
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 20,
        color: "#fff",
        position: "absolute",
        top: 20,
        left: 0
    },
    popupViewCloseButton: {
        width: windowWidth - 40,
        height: 50,
        position: "absolute",
        bottom: 25,
        left: 20,
        borderRadius: 12,
        backgroundColor: "#A915FF"
    },
    popupViewCloseButtonText: {
        width: "100%",
        textAlign: "center",
        color: "#fff",
        fontFamily: "Formular-Bold",
        position: 'absolute',
        left: 0,
        top: 15
    },
    notificationTitle: {
        width: "100%",
        textAlign: "center",
        fontFamily: "Formular-Medium",
        fontSize: 18,
        position: "absolute",
        top: 10,
        left: 0,
        color: "#fff"
    },
    notificationText: {
        width: windowWidth - 40,
        height: windowHeight - 360,
        textAlign: "center",
        color: "#fff",
        fontFamily: "Formular",
        position: "absolute",
        left: 20,
        top: 60
    },
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

export default ReservationsScreen