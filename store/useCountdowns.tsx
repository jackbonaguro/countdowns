import { refreshCountdowns, storeCountdown, updateCountdown } from '@/controllers/storageController';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type Countdown = {
  title: string;
  date: Date;
  time?: Date;
  emoji: string;
  hue: number;
}

// Query hook to fetch countdowns
export const useCountdowns = () => {
  const queryClient = useQueryClient();

  return useQuery<(Countdown | undefined)[]>({
    queryKey: ['countdowns'],
    queryFn: async () => {
      const countdowns = await refreshCountdowns(queryClient);
      return countdowns;
    },
  });
};

export const useCreateCountdown = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (countdown: Countdown) => {
      await storeCountdown(countdown, queryClient);
      await queryClient.invalidateQueries({ queryKey: ['countdowns'] });
    },
  });
};

export const useEditCountdown = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ index, countdown }: { index: number, countdown: Countdown }) => {
      await updateCountdown(index, countdown, queryClient);
      await queryClient.invalidateQueries({ queryKey: ['countdowns'] });
    },
  });
};


