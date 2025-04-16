import { getStatus } from "@/controllers/APIController";
import { useEffect, useState } from "react";
import { usePreferences } from "./usePreferences";

export enum APIStatus {
  LOADING = 'loading',
  UP = 'up',
  DOWN = 'down',
};

export default function useAPIStatus() {
  const [status, setStatus] = useState<APIStatus>(APIStatus.LOADING);
  const { data: preferences, isLoading: preferencesLoading } = usePreferences();

  const fetch = async () => {
    setStatus(APIStatus.LOADING);

    const apiUp = await getStatus();

    setStatus(apiUp ? APIStatus.UP : APIStatus.DOWN);
  }

  useEffect(() => {
    fetch();
  }, [preferences, preferencesLoading]);

  return {
    status,
    refetch: fetch,
  };
}
