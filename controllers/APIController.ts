import { type Preferences } from "@/hooks/usePreferences";
import { queryClient } from "./QueryClientController";
import { DEFAULT_PREFERENCES } from "./DatabaseController";

let _apiURL = DEFAULT_PREFERENCES.baseUrl;
export const setAPIUrl = (url: string) => {
  _apiURL = url;
};
const getAPIUrl = (): string => {
  return _apiURL;
};

export async function register(token: string) {
  try {
    const response = await fetch(`${getAPIUrl()}/app`, {
      headers: {
        'Authorization': token,
      }
    });
    if (!response.ok) {
      console.error('Response', response)
      throw new Error('Bad response for /app');
    }
  } catch (error) {
    console.error('Failed to register device', error);
  }
}

export async function getStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${getAPIUrl()}/status`);
    if (!response.ok) {
      console.error('Response', response)
      throw new Error('Bad response for /status');
    }
    const data = await response.json() as { status: string };
    return data.status === 'ok';
  } catch (error) {
    return false;
  }
}
