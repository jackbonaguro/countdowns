import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles';
import { LinearGradient } from 'expo-linear-gradient';
import { setBackgroundColorAsync } from 'expo-navigation-bar';
import { queryClient as globalQueryClient } from '@/controllers/QueryClientController';

export function ScreenContainer(props: PropsWithChildren) {
  return (
    <LinearGradient
      colors={[colors.appBgTop, colors.appBgBottom]} 
      style={{
        flex: 1,
      }}
    >
      {props.children}
    </LinearGradient>
  )
}

export default function RootLayout() {
  const [queryClient] = useState(globalQueryClient);

  useEffect(() => {
    if (Platform.OS === 'android') setBackgroundColorAsync(colors.appBgBottom);
  }, []);
  return (
    <SQLiteProvider databaseName="countdowns.db">
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.appBgTop} />
          <ScreenContainer>
            <SafeAreaView style={{ flex: 1 }}>
              {/* <Slot /> */}
              <Stack
                screenOptions={{
                  navigationBarHidden: true,
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: 'rgba(0,0,0,0)',
                  }
                }}
              />
            </SafeAreaView>
          </ScreenContainer>
      </QueryClientProvider>
    </SQLiteProvider>
  );
}
