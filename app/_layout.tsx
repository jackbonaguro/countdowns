import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  return (

    <SQLiteProvider databaseName="countdowns.db">
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={{ flex: 1 }}>
          <Slot />
        </SafeAreaView>
      </QueryClientProvider>
    </SQLiteProvider>
  );
}
