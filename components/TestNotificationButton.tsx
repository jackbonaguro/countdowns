import { Countdown } from "@/hooks/useCountdowns";
import Button from "./Button";
import { createCountdown, ReminderPeriod } from "@/controllers/APIController";
import { getDeviceToken } from "@/controllers/NotificationController";

const createTestCountdown = async () => {
  console.log('createTestCountdown');
  const testDate = new Date(Date.now() + 60_000);

  // Create a new countdown
  const countdown: Countdown = {
    title: 'Test Notifications',
    emoji: '💣',
    date: testDate,
    id: Math.floor(Math.random() * 1e16),
    color: '#ff00ff',
  };

  const token = await getDeviceToken();

  console.log('creating countdown on server with', countdown, token);

  await createCountdown(countdown, [
    {
      period: ReminderPeriod.IMMEDIATE,
    }
  ], token);

  console.log('created countdown on server!');
};

const TestNotificationButton = (props: {
}) => {
  return (
    <Button
      title="Test Notifications"
      onPress={createTestCountdown}
    />
  )
};

export default TestNotificationButton;
