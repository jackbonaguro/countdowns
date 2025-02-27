import { Countdown } from '@/store/useCountdowns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';

export const initialize = async (queryClient: QueryClient) => {
  await refreshCountdowns(queryClient);
}

const serializeCountdown = (countdown: Countdown) => {
  const countdownWithISODate = {
    ...countdown,
    date: countdown.date.toISOString(),
    time: countdown.time?.toISOString() || undefined,
  }
  return JSON.stringify(countdownWithISODate);
}

const deserializeCountdown = (countdown: string) => {
  const countdownWithISODate = JSON.parse(countdown);
  return {
    ...countdownWithISODate,
    date: new Date(countdownWithISODate.date),
    time: countdownWithISODate.time ? new Date(countdownWithISODate.time) : undefined,
  }
}

export const refreshCountdowns = async (queryClient: QueryClient) => {
  // Read size
  let sizeStr = await AsyncStorage.getItem('numCountdowns');
  if (sizeStr === null) {
    // First time app is ever opened
    sizeStr = '0';
    await AsyncStorage.setItem('numCountdowns', sizeStr);
  }

  let size = 0;
  try {
    size = parseInt(sizeStr);
  } catch(err) {}

  const countdowns: (Countdown | undefined)[] = [];
  for (let i = 0; i < size; i++) {
    const countdownKey = `countdowns/${i.toString()}`;
    const countdownStr = await AsyncStorage.getItem(countdownKey);
    if (countdownStr === null) {
      countdowns.push(undefined);
      continue;
    }
    const countdown = deserializeCountdown(countdownStr);
    countdowns.push(countdown);
  }

  console.log('countdowns', JSON.stringify(countdowns));
  // For results, both set and return
  queryClient.setQueryData(['countdowns'], countdowns);
  return countdowns;
}

export const storeCountdown = async (countdown: Countdown, queryClient: QueryClient) => {
  const serializedCountdown = serializeCountdown(countdown);
  const countdowns = queryClient.getQueryData(['countdowns']) as Countdown[];
  const countdownKey = `countdowns/${countdowns?.length || 0}`;
  await AsyncStorage.setItem(countdownKey, serializedCountdown);

  // Now that countdown is stored, increment counter
  await AsyncStorage.setItem('numCountdowns', ((countdowns?.length | 0) + 1).toString());
}

export const updateCountdown = async (index: number, countdown: Countdown, queryClient: QueryClient) => {
  const serializedCountdown = serializeCountdown(countdown);
  const countdownKey = `countdowns/${index}`;
  await AsyncStorage.setItem(countdownKey, serializedCountdown);
}

export const deleteCountdown = async (index: number, queryClient: QueryClient) => {
  const countdownKey = `countdowns/${index}`;
  await AsyncStorage.removeItem(countdownKey);
}

const exampleCountdowns: Countdown[] = [
  {
    title: 'New Year',
    date: new Date('2026-01-01'),
    emoji: '🎉',
    hue: 0,
  },
  {
    title: 'Christmas',
    date: new Date('2025-12-25'),
    emoji: '🎄',
    hue: 100,
  },
  {
    title: 'Birthday',
    date: new Date(Date.now() + 1000 * 12),
    emoji: '🎂',
    hue: 200,
  },
  {
    title: 'Birthday 2',
    date: new Date(Date.now() + 1000 * 2),
    emoji: '🎂',
    hue: 240,
  },
];
export const populateExample = async(queryClient: QueryClient) => {
  // Hard reset
  const countdowns = queryClient.getQueryData(['countdowns']) as Countdown[];
  if (!!countdowns) {
    for (let i = 0; i < countdowns.length; i++) {
      const countdownKey = `countdowns/${i}`;
      await AsyncStorage.removeItem(countdownKey);
    }
  }

  for (let i = 0; i < exampleCountdowns.length; i++) {
    const exampleCountdown = exampleCountdowns[i];
    const serializedCountdown = serializeCountdown(exampleCountdown);
    const countdownKey = `countdowns/${i}`
    await AsyncStorage.setItem(countdownKey, serializedCountdown);
  }
  await AsyncStorage.setItem('numCountdowns', exampleCountdowns.length.toString());
}
