// @ts-ignore 
import { setAPIUrl } from "@/controllers/APIController";
import { getPreferences, updatePreferences } from "@/controllers/DatabaseController";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";

export type Preferences = {
  baseUrl: string;
}

// Query hook to fetch countdowns
export const usePreferences = () => {
  const db = useSQLiteContext();

  return useQuery<Preferences | undefined>({
    queryKey: ['preferences'],
    queryFn: async () => {
      const preferences = await getPreferences(db);
      if (preferences?.baseUrl) setAPIUrl(preferences.baseUrl);
      return preferences;
    },
  });
}

export const usePatchPreferences = () => {
  const queryClient = useQueryClient();
  const db = useSQLiteContext();

  return useMutation({
    mutationFn: async (patch: Partial<Preferences>) => {
      await updatePreferences(patch, db);
      await queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });
}
