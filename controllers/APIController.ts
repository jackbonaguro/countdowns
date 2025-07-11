import { type Preferences } from "@/hooks/usePreferences";
import { queryClient } from "./QueryClientController";
import { DEFAULT_PREFERENCES } from "./DatabaseController";
import { Countdown } from "@/hooks/useCountdowns";

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

export enum ReminderPeriod {
  IMMEDIATE = 'immediate',
  ONE_MIN_BEFORE = '1_min_before',
  FIVE_MIN_BEFORE = '5_min_before',
  TEN_MIN_BEFORE = '10_min_before',
  FIFTEEN_MIN_BEFORE = '15_min_before',
  THIRTY_MIN_BEFORE = '30_min_before',
  ONE_HR_BEFORE = '1_hr_before',
  TWO_HR_BEFORE = '2_hr_before',
  ONE_DAY_BEFORE = '1_day_before',
  CUSTOM = 'custom'
};
export type Reminder = {
  period: Exclude<ReminderPeriod, ReminderPeriod.CUSTOM>
} | {
  period: ReminderPeriod.CUSTOM,
  customPeriod: number
};
export async function createCountdown(countdown: Countdown, reminders: Reminder[], token: string) {
  try {
    const response = await fetch(`${getAPIUrl()}/app/countdown/`, {
      method: 'POST',
      body: JSON.stringify({
        countdown: {
          ...countdown,
          date: countdown.date.toISOString(),
          time: countdown.time?.toISOString(),
        },
        reminders,
      }),
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      console.error('Response', response)
      throw new Error('Bad response for /status');
    }
    const data = await response.json() as { status: string };
    return data;
  } catch (error) {
    return false;
  }
}
