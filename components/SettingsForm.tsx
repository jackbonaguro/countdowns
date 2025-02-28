import { SafeAreaView, View } from "react-native";
import Button from "./Button";
import Form from "./Form";
import FormLabel from "./FormLabel";
import FormInput from "./FormInput";
import { useState, useEffect } from "react";
import { getDeviceToken } from "@/controllers/NotificationController";

export default function SettingsForm(props: {
  onClose: () => void;
}) {

  const [deviceToken, setDeviceToken] = useState<string>();

  useEffect(() => {
    getDeviceToken().then(setDeviceToken);
  }, [deviceToken]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={{
          paddingHorizontal: 16,
          paddingBottom: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Button title="Close" onPress={async () => {
            props.onClose();
          }} />
        </View>
        <Form>
          <FormLabel>FCM Identifier</FormLabel>
          <FormInput value={deviceToken} disabled/>
          <FormLabel>Server URL</FormLabel>
          <FormInput />
        </Form>
      </SafeAreaView>
  );
}
