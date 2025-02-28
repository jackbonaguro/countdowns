import Button from "@/components/Button";
import CountdownEditor from "@/components/CountdownEditor";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Countdown, useCountdowns, useDeleteCountdown, useEditCountdown } from "@/store/useCountdowns";
import { useSQLiteContext } from "expo-sqlite";
import BigButton from "@/components/BigButton";
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
            console.log('delete countdown', id);
            await deleteCountdown(id);
            router.back();
          }} />
        </View>
        <ScrollView style={{
          padding: 16,
        }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold' }}>Edit Countdown</Text>
          <CountdownEditor
            initialCountdown={countdown}
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
  )
}
