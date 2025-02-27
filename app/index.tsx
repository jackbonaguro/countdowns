import Button from '@/components/Button';
import CountdownPreview from '@/components/CountdownPreview';
import { initialize } from '@/controllers/storageController';
import { useCountdowns, Countdown } from '@/store/useCountdowns';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import notifee from '@notifee/react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function onDisplayNotification() {
  // Request permissions (required for iOS)
  await notifee.requestPermission()

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: 'Notification Title',
    body: 'Main body content of the notification',
    android: {
      channelId,
      smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}

function CountdownsList(props: { initialized: boolean, sort: 'asc' | 'desc' }) {
  const { data: countdowns } = useCountdowns();

  const countdownsWithIndex: undefined | {
    index: number;
    countdown?: Countdown;
  }[] = countdowns?.map((countdown, index) => ({
    index,
    countdown,
  })) ?? undefined;

  const countdownsSorted = countdownsWithIndex?.sort((a, b) => {
    if (!a.countdown || !b.countdown) return 0;
    if (props.sort === 'asc') {
      return b.countdown.date.getTime() - a.countdown.date.getTime();
    } else {
      return a.countdown.date.getTime() - b.countdown.date.getTime();
    }
  });

  // @ts-ignore
  if (!props.initialized || !countdownsSorted) return (<></>);

  return (
    <View style={{
      rowGap: 16, 
      flex: 1,
    }}>
      {countdownsSorted.map((cdi, index) => {
        if (!cdi.countdown) return null;
        return (<CountdownPreview key={index} countdown={cdi.countdown} index={cdi.index} />);
      })}
    </View>
  );
}

export default function HomeScreen() {
  const queryClient = useQueryClient();

  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    (async () => {
      if (!initialized) {
        await initialize(queryClient);
        setInitialized(true);
      }
    })();
  }, [initialized]);

  const [sort, setSort] = useState<'asc' | 'desc'>('asc');

  return (
    <View style={{ flex: 1 }}>
      <View style={{
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Button title="Sort" onPress={async () => {
          setSort(sort === 'asc' ? 'desc' : 'asc');
        }} />
        <Link href='/createCountdown' asChild>
          <Button title="Add" onPress={async () => {}} />
        </Link>
      </View>
      <ScrollView style={{
        padding: 16,
      }}>
        <Text style={styles.text}>Countdowns</Text>
        <CountdownsList initialized={initialized} sort={sort}/>
      </ScrollView>
      <Button title="Test Notification" onPress={async () => {
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Look at that notification',
            body: "I'm so proud of myself!",
          },
          trigger: null,
        });

        await onDisplayNotification();
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingBottom: 16,
  },
});
