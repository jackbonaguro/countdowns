import Button from "@/components/Button";
import CountdownEditor from "@/components/CountdownEditor";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Countdown, useCountdowns, useEditCountdown } from "@/store/useCountdowns";
import { deleteCountdown } from "@/controllers/storageController";
import { useQueryClient } from "@tanstack/react-query";
export default function EditCountdown() {
  const [valid, setValid] = useState(false);
  const [draftCountdown, setDraftCountdown] = useState<Countdown>();
  
  const queryClient = useQueryClient();
  const { mutateAsync: editCountdown } = useEditCountdown();

  const { index: indexStr } = useLocalSearchParams();
  const index = parseInt(indexStr as string);
  const { data: countdowns } = useCountdowns();
  const countdown = countdowns?.[index];

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
            console.log('delete countdown', index);
            await deleteCountdown(index, queryClient);
            await queryClient.invalidateQueries({ queryKey: ['countdowns'] });
            router.back();
          }} />
        </View>
        <ScrollView style={{
          padding: 16,
        }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold' }}>Edit Countdown</Text>
          <CountdownEditor
            countdown={countdown}
            onValidate={(countdown, valid) => {
              setDraftCountdown(countdown);
              setValid(valid);
            }} />
        </ScrollView>
      </View>
      <View style={{
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}>
        <TouchableOpacity
          disabled={!valid}
          style={{
            padding: 16,
            backgroundColor: valid ? 'green' : 'gray',
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={async () => {
            if (!draftCountdown) return;
            await editCountdown({
              index,
              countdown: draftCountdown,
            });
            router.back();
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Update Countdown!</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
