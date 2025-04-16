import Button from "./Button";

const createTestCountdown = async () => {
  console.log('createTestCountdown');
  const testDate = new Date(Date.now() + 60_000);
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
