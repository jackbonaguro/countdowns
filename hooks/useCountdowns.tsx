import { refreshCountdowns, createCountdown, updateCountdown, deleteCountdown } from '@/controllers/DatabaseController';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

export type Countdown = {
  id: number;
  title: string;
  date: Date;
  time?: Date;
  emoji: string;
  color: string;
  archived?: boolean;
}

// Util function to get combined date & time
export const getCountdownDatetime = (countdown: Pick<Countdown, 'date' | 'time'>) => {
  return new Date(
    countdown.date.getFullYear(),
    countdown.date.getMonth(),
    countdown.date.getDate(),
    countdown.time?.getHours() ?? 0,
    countdown.time?.getMinutes() ?? 0
  );
};

// Query hook to fetch countdowns
export const useCountdowns = () => {
  const db = useSQLiteContext();

  return useQuery<Countdown[]>({
    queryKey: ['countdowns'],
    queryFn: async () => (await refreshCountdowns(db)),
  });
};

export const useCreateCountdown = () => {
  const queryClient = useQueryClient();
  const db = useSQLiteContext();

  return useMutation({
    mutationFn: async (countdown: Omit<Countdown, 'id'>) => {
      try {
        await createCountdown(countdown, db);
        await queryClient.invalidateQueries({ queryKey: ['countdowns'] });
      } catch (error) {
        console.error('Error creating countdown', error);
      }
    },
  });
};

export const useEditCountdown = () => {
  const queryClient = useQueryClient();
  const db = useSQLiteContext();

  return useMutation({
    mutationFn: async ({ countdown }: { countdown: Countdown }) => {
      await updateCountdown(countdown, db);
      await queryClient.invalidateQueries({ queryKey: ['countdowns'] });
    },
  });
};

export const useDeleteCountdown = () => {
  const queryClient = useQueryClient();
  const db = useSQLiteContext();

  return useMutation({
    mutationFn: async (index: number) => {
      await deleteCountdown(index, db);
      await queryClient.invalidateQueries({ queryKey: ['countdowns'] });
    },
  });
};
