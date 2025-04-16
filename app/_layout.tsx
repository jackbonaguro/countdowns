import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles';
import { LinearGradient } from 'expo-linear-gradient';
import { setBackgroundColorAsync } from 'expo-navigation-bar';
import { queryClient as globalQueryClient } from '@/controllers/QueryClientController';

export default function RootLayout() {
  const [queryClient] = useState(globalQueryClient);

  useEffect(() => {
    if (Platform.OS === 'android') setBackgroundColorAsync(colors.appBgBottom);
  }, []);
  return (
    <SQLiteProvider databaseName="countdowns.db">
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.appBgTop} />
        <LinearGradient
          colors={[colors.appBgTop, colors.appBgBottom]} 
          style={{
            flex: 1,
          }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <Slot />
          </SafeAreaView>
        </LinearGradient>
        {/* </View> */}
      </QueryClientProvider>
    </SQLiteProvider>
  );
}
