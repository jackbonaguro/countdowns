
import messaging from '@react-native-firebase/messaging';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

let initialized = false;

export async function initialize() {
  if (initialized) return;

  await requestUserPermission();
  await subscribeToNotifications();
  initialized = true;
}
export function isInitialized() {
  return initialized;
}

export async function requestUserPermission() {
  if (Platform.OS === 'android') {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  } else if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
}

let unsubscribe: () => void;
export async function subscribeToNotifications() {
  unsubscribe = messaging().onMessage((remoteMessage) => {
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });
}
export async function subscribeToBackgroundNotifications() {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    console.log('A new background FCM message arrived!', JSON.stringify(remoteMessage));
  });
}

export async function getDeviceToken() {
  try {
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.error('Error getting device token', error);
    throw error;
  }
};

