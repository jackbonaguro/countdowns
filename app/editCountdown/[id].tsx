import Button from "@/components/Button";
import CountdownEditor from "@/components/CountdownEditor";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, ScrollView, Text, View } from "react-native";
import { useState } from "react";
import { Countdown, useCountdowns, useDeleteCountdown, useEditCountdown } from "@/hooks/useCountdowns";
import { useSQLiteContext } from "expo-sqlite";
import BigButton from "@/components/BigButton";
import { ScreenContainer } from "../_layout";
export default function EditCountdown() {
  const [valid, setValid] = useState(false);
  const [draftCountdown, setDraftCountdown] = useState<Countdown>();
  
  const db = useSQLiteContext();
  const { mutateAsync: editCountdown } = useEditCountdown();
  const { mutateAsync: deleteCountdown } = useDeleteCountdown();

  const { id: idStr } = useLocalSearchParams();
  const id = parseInt(idStr as string);
  const { data: countdowns } = useCountdowns();
  const countdown = countdowns?.find(c => c?.id === id);

  return (
    <ScreenContainer>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Button title="Cancel" onPress={async () => {
              router.back();
            }} />
            <Button title="Delete" onPress={async () => {
              Alert.alert('Delete Countdown', 'Are you sure you want to delete this countdown?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: async () => {
                  console.log('delete countdown', id);
                  await deleteCountdown(id);
                  router.back();
                } },
              ]);
            }} />
          </View>
          <ScrollView style={{
            padding: 16,
          }}>
            <Text style={{ fontSize: 32, fontWeight: 'bold' }}>Edit Countdown</Text>
            <CountdownEditor
              initialCountdown={countdown}
              allowArchive={true}
              onValidate={(countdown, valid) => {
                setDraftCountdown({
                  ...countdown,
                  id,
                });
                setValid(valid);
              }} />
          </ScrollView>
        </View>
        <View style={{ padding: 16 }}>
          <BigButton
            disabled={!valid}
            title="Update Countdown!"
            onPress={async () => {
              if (!draftCountdown) return;
              await editCountdown({
                countdown: draftCountdown,
              });
              router.back();
            }}
          />
        </View>
      </View>
    </ScreenContainer>
  )
}
