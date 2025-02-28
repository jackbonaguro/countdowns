import Button from '@/components/Button';
import CountdownPreview from '@/components/CountdownPreview';
import { useCountdowns, Countdown } from '@/store/useCountdowns';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as DatabaseController from '@/controllers/DatabaseController';
import * as NotificationController from '@/controllers/NotificationController';
import { useSQLiteContext } from 'expo-sqlite';
import SettingsForm from '@/components/SettingsForm';
import Modal from '@/components/Modal';

// Do this as soon as possible when app is loaded, not in the component's lifecycle.
NotificationController.subscribeToBackgroundNotifications();

function CountdownsList(props: { sort: 'asc' | 'desc' }) {
  const { data: countdowns, isLoading } = useCountdowns();

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
  if (isLoading || !countdownsSorted) return (<></>);

  return (
    <View style={{
      rowGap: 16, 
      flex: 1,
    }}>
      {countdownsSorted.map((cdi, index) => {
        if (!cdi.countdown) return null;
        return (<CountdownPreview key={index} countdown={cdi.countdown} id={cdi.countdown.id} />);
      })}
    </View>
  );
}

export default function HomeScreen() {
  const db = useSQLiteContext();

  // Initialize all controllers
  useEffect(() => {
    (async () => {
      if (!DatabaseController.isInitialized()) {
        await DatabaseController.initialize();
        await DatabaseController.refreshCountdowns(db);
      }
      if (!NotificationController.isInitialized()) {
        await NotificationController.initialize();
      }
    })();
  }, []);

  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [settingsVisible, setSettingsVisible] = useState(false);
  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <View style={{ flex: 1 }}>
        <View style={{
          paddingHorizontal: 16,
          paddingBottom: 8,
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
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}>
          <Text style={styles.text}>Countdowns</Text>
          <CountdownsList sort={sort}/>
        </ScrollView>
      </View>
      {/* <Button title="Test Notification" onPress={async () => {
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Look at that notification',
            body: "I'm so proud of myself!",
          },
          trigger: null,
        });

        await onDisplayNotification();
      }} /> */}
      <View style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}>
        <TouchableOpacity onPress={async () => {
          setSettingsVisible(true);
        }}>
          <Text style={{ fontSize: 38, color: 'grey', fontWeight: 'bold', opacity: 0.5 }}>⚙</Text>
        </TouchableOpacity>
        <Modal
          visible={settingsVisible}
        >
          <SettingsForm onClose={() => setSettingsVisible(false)} />
        </Modal>
      </View>
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
