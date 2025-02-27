import { initialize } from '@/controllers/storageController';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      if (!initialized) {
        await initialize(queryClient);
        setInitialized(true);
      }
    })();
  }, [initialized]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1 }}>
        {initialized && <Slot />}
      </SafeAreaView>
    </QueryClientProvider>
  );
}
