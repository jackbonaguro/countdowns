import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Button from "./Button";
import Form from "./Form";
import FormLabel from "./FormLabel";
import FormInput from "./FormInput";
import { useState, useEffect } from "react";
import { getDeviceToken } from "@/controllers/NotificationController";
import { usePatchPreferences, usePreferences } from "@/hooks/usePreferences";
import { colors } from "@/styles";

export default function SettingsForm(props: {
  onClose: () => void;
}) {
  const { data: preferences, isLoading: preferencesLoading } = usePreferences();

  console.log('preferences in settings form', preferences, 'isLoading', preferencesLoading);
  const { mutateAsync: patchPreferences } = usePatchPreferences();

  const [deviceToken, setDeviceToken] = useState<string>();

  useEffect(() => {
    getDeviceToken().then(setDeviceToken);
  }, [deviceToken]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
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
        <ScrollView style={{ paddingHorizontal: 16 }}>
          <Form>
            <FormLabel>FCM Identifier</FormLabel>
            <FormInput value={deviceToken} disabled/>
            <FormLabel>API Base URL</FormLabel>
            <FormInput
              value={preferences?.baseUrl}
              onChangeText={async(value: string) => {
                await patchPreferences({
                  baseUrl: value
                })
              }}
              disabled={preferencesLoading}
            />
            <Text style={{ color: colors.text.secondary }}>
              {preferencesLoading ? 'Saving...' : 'Saved'}
            </Text>
          </Form>
        </ScrollView>
      </SafeAreaView>
  );
}
