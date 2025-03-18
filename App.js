
import Constants from 'expo-constants';
import { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Platform, StyleSheet } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';

export default function App() {
    const webViewRef = useRef(null);
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
        BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [canGoBack]);

    const swipeGesture = Gesture.Pan()
        .onEnd((event) => {
            if (event.translationX > 70) {
                backAction()
            }
        });
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GestureDetector gesture={swipeGesture}>
                <WebView
                    ref={webViewRef}
                    style={styles.container}
                    source={{ uri: 'https://topdoc.kz' }}
                    onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
                />
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? Constants.statusBarHeight : 0,
    },
});




