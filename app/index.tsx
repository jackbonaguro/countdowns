import Button from '@/components/Button';
import CountdownPreview from '@/components/CountdownPreview';
import { useCountdowns, Countdown, getCountdownDatetime } from '@/hooks/useCountdowns';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as DatabaseController from '@/controllers/DatabaseController';
import * as NotificationController from '@/controllers/NotificationController';
import { useSQLiteContext } from 'expo-sqlite';
import SettingsForm from '@/components/SettingsForm';
import Modal from '@/components/Modal';
import { getDeviceToken } from '@/controllers/NotificationController';
import * as APIController from '@/controllers/APIController';
import StatusFooter from '@/components/StatusFooter';
import SortToggle from '@/components/SortToggle';
import ArchiveTabSwitcher from '@/components/ArchiveTabSwitcher';
import styled from 'styled-components/native';
import TestNotificationButton from '@/components/TestNotificationButton';
// Do this as soon as possible when app is loaded, not in the component's lifecycle.
NotificationController.subscribeToBackgroundNotifications();

export enum CountdownCategory {
  ONGOING = 'ongoing',
  PAST = 'past',
  ARCHIVED = 'archived',
};

type CountdownWithIndex = {
  index: number;
  countdown: Countdown;
};

function CountdownsList(props: { sort: 'asc' | 'desc'; category: CountdownCategory }) {
  const { data: countdowns, isLoading } = useCountdowns();

  // Filtered list as state, since clock updates can change it
  const [filteredCountdowns, setFilteredCountdowns] = useState<Countdown[]>();
  const updateFilteredCountdowns = () => {
    let tempCountdowns: Countdown[] | undefined;
    if (props.category === CountdownCategory.PAST) {
      tempCountdowns = countdowns?.filter((c) => {
        const dateTime = getCountdownDatetime(c).getTime();
        return !c.archived && dateTime < Date.now();
      });
    } else if (props.category === CountdownCategory.ONGOING) {
      tempCountdowns = countdowns?.filter((c) => {
        const dateTime = getCountdownDatetime(c).getTime();
        return !c.archived && dateTime >= Date.now();
      });
    } else { // ARCHIVED
      tempCountdowns = countdowns?.filter((c) => {
        return !!c.archived;
      });
    }
    return setFilteredCountdowns(tempCountdowns);
  };
  useEffect(() => {
    updateFilteredCountdowns();
    const updateInterval = setInterval(updateFilteredCountdowns, 1000);
    return () => clearInterval(updateInterval);
  }, [props.category, countdowns]);

  // Now that stateful filtering is done, sort for the final list
  const sortedCountdowns = filteredCountdowns?.sort((a, b) => {
    const aDatetime = getCountdownDatetime(a).getTime();
    const bDatetime = getCountdownDatetime(b).getTime();

    if (props.sort === 'asc') return bDatetime - aDatetime;
    return aDatetime - bDatetime;
  });

  // @ts-ignore
  if (isLoading || !sortedCountdowns) return (<></>);

  return (
    <View style={{
      rowGap: 16, 
      flex: 1,
    }}>
      {sortedCountdowns.map((c) => {
        return (<CountdownPreview key={c.id} countdown={c} id={c.id} />);
      })}
    </View>
  );
}

const NavButtonContainer = styled.View`
  flex: 1;
  flexDirection: row;
  alignItems: center;
`;

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

  // Register device on app load
  const [deviceToken, setDeviceToken] = useState<string>();
  useEffect(() => {
    getDeviceToken().then(setDeviceToken);
    if (deviceToken) {
      APIController.register(deviceToken);
    }
  }, [deviceToken]);

  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [pastSort, setPastSort] = useState<'asc' | 'desc'>('asc');
  const [archivedSort, setArchivedSort] = useState<'asc' | 'desc'>('asc');
  const [showingArchived, setShowingArchived] = useState<boolean>(false);

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
          <NavButtonContainer />
          <ArchiveTabSwitcher archived={showingArchived} onChange={setShowingArchived} />
          <NavButtonContainer style={{ justifyContent: 'flex-end' }}>
            <Link href='/createCountdown' asChild>
              <Button title="Add" onPress={async () => {}} />
            </Link>
          </NavButtonContainer>
        </View>
        <ScrollView style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          display: showingArchived ? 'none' : 'flex'
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 16,
          }}>
            <Text style={styles.header}>Countdowns</Text>
            <SortToggle
              label={sort === 'desc' ? 'Closest' : 'Furthest'}
              onPress={() => setSort(sort === 'asc' ? 'desc' : 'asc')}
              ascending={sort === 'asc'}
            ></SortToggle>
          </View>
          <CountdownsList sort={sort} category={CountdownCategory.ONGOING}/>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }} >
            <Text style={[styles.sectionHeader, {
              paddingVertical: 16,
            }]}>Past</Text>
            <SortToggle
              label={pastSort === 'desc' ? 'Distant' : 'Recent'}
              onPress={() => setPastSort(pastSort === 'asc' ? 'desc' : 'asc')}
              ascending={pastSort === 'asc'}
            ></SortToggle>
          </View>
          <CountdownsList sort={pastSort} category={CountdownCategory.PAST}/>
        </ScrollView>
        <ScrollView style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          display: showingArchived ? 'flex' : 'none'
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 16,
          }}>
            <Text style={styles.header}>Archived</Text>
            <SortToggle
              label={archivedSort === 'desc' ? 'Oldest' : 'Newest'}
              onPress={() => setArchivedSort(archivedSort === 'asc' ? 'desc' : 'asc')}
              ascending={archivedSort === 'asc'}
            ></SortToggle>
          </View>
          <CountdownsList sort={archivedSort} category={CountdownCategory.ARCHIVED}/>
        </ScrollView>

        <View style={{ paddingHorizontal: 16 }}>
          <StatusFooter onPress={() => setSettingsVisible(true)} />
        </View>
      </View>

      {/* End of main content, now modals */}

      <Modal
        visible={settingsVisible}
      >
        <SettingsForm onClose={() => setSettingsVisible(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
  }
});
