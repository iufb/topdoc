import Constants from 'expo-constants';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Button, Platform, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { MMKV } from 'react-native-mmkv';
import { WebView } from 'react-native-webview';

const storage = new MMKV()
export default function App() {
    const webViewRef = useRef(null);
    const [agreed, setAgreed] = useState(false)
    const [loading, setLoading] = useState(true)
    const [canGoBack, setCanGoBack] = useState(false);

    const [appIsReady, setAppIsReady] = useState(false);

    const backAction = () => {
        if (canGoBack && webViewRef.current) {
            webViewRef.current.goBack();
            return true;
        } else {
            if (Platform.OS == 'android') {
                Alert.alert('Выход из приложения', 'Вы действительно хотите закрыть приложение?', [
                    { text: 'Отмена', style: 'cancel' },
                    { text: 'Выйти', onPress: () => BackHandler.exitApp() }
                ]);
            }
            return true;
        }
    };
    useEffect(() => {
        if (storage.getBoolean('cookieConsent')) {
            setAgreed(true)
        }
    }, [])

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [canGoBack]);

    const swipeGesture = Gesture.Pan()
        .onEnd((event) => {
            if (event.translationX > 70) {
                backAction()
            }

        });
    const onAccept = () => {
        setAgreed(true)
        storage.set('cookieConsent', true)
    }
    if (!agreed) {
        return <ConsentScreen onAccept={onAccept} />
    }
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GestureDetector gesture={swipeGesture}>
                <View style={{ flex: 1 }}>
                    {loading && <View style={[styles.loader]} >
                        <ActivityIndicator size={'large'} color={'#37b9b7'} />
                    </View>}
                    <WebView
                        onLoadEnd={() => setLoading(false)}
                        ref={webViewRef}
                        style={styles.container}
                        source={{ uri: 'https://topdoc.kz' }}
                        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
                    />
                </View>
            </GestureDetector>
        </GestureHandlerRootView >
    );
}

const ConsentScreen = ({ onAccept }) => {
    return (
        <View style={styles.consentContainer}>
            <Text style={styles.title}>Согласие на использование файлов cookie</Text>
            <Text style={styles.text} >
                Мы используем файлы cookie для улучшения работы приложения. Продолжая использование, вы соглашаетесь с их использованием.
            </Text>
            <Button title="Принять и продолжить" onPress={onAccept} />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? Constants.statusBarHeight : 0,
    },
    consentContainer: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? Constants.statusBarHeight : 0,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 10,

    },
    loader: {
        position: 'absolute',
        top: Platform.OS == 'ios' ? Constants.statusBarHeight : 0,
        left: 0, right: 0, bottom: 0,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',

    },
    title: {
        fontSize: 24, textAlign: 'center', color: "#37b9b7", fontWeight: 'bold'
    },
    text: { textAlign: 'center', fontSize: 18 }
});




