import EmojiSelector from "react-native-emoji-selector";
import Animated from "react-native-reanimated";
import Button from "./Button";
import { SafeAreaView, View } from "react-native";

export default function EmojiInput(props: {
  onEmojiSelected: (emoji: string) => void;
  onCancel: () => void;
}) {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 16 }}>
      <View style={{
          paddingHorizontal: 16,
          flexDirection: 'row',
          // justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Button title="Cancel" onPress={async () => {
            props.onCancel();
          }} />
      </View>
      <EmojiSelector
        onEmojiSelected={(emoji) => {
          props.onEmojiSelected(emoji);
        }}
      />
    </SafeAreaView>
  )
}
