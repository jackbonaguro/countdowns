import Button from "@/components/Button";
import CountdownEditor from "@/components/CountdownEditor";
import { router, Stack, useNavigation } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Countdown, useCreateCountdown } from "@/hooks/useCountdowns";
import BigButton from "@/components/BigButton";
import { ScreenContainer } from "./_layout";
export default function CreateCountdown() {
  // const navigation = useNavigation();
  // useEffect(() => {
  //   navigation.setOptions({ animation: 'fade' });
  // }, [navigation]);

  const [valid, setValid] = useState(false);
  const [draftCountdown, setDraftCountdown] = useState<Omit<Countdown, 'id'>>();

  const { mutateAsync: createCountdown } = useCreateCountdown();

  return (
    // <Stack.Screen name="your-screen" options={{ animation: 'slide_from_bottom' }}>
      <ScreenContainer>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <View style={{
              paddingHorizontal: 16,
              flexDirection: 'row',
              // justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Button title="Cancel" onPress={async () => {
                router.back();
              }} />
            </View>
            <ScrollView style={{
              padding: 16,
            }}>
              <Text style={{ fontSize: 32, fontWeight: 'bold' }}>Create Countdown</Text>
              <CountdownEditor onValidate={(countdown, valid) => {
                setDraftCountdown(countdown);
                setValid(valid);
              }} />
            </ScrollView>
          </View>
          <View style={{ padding: 16 }}>
            <BigButton
              disabled={!valid}
              title="Start the Countdown!"
              onPress={async () => {
                if (!draftCountdown) return;
                await createCountdown(draftCountdown);
                router.back();
              }}
            />
          </View>
        </View>
      </ScreenContainer>
  )
}
