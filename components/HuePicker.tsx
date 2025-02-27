import { ScrollView, Text, TouchableOpacity, View } from "react-native";

function HueCircle(props: { hue: number, isSelected: boolean }) {
  return (
    <View style={{
      width: 28,
      height: 28,
      borderRadius: 100,
      borderWidth: 2,
      borderColor: props.isSelected ? 'grey' : 'white',
      backgroundColor: `hsl(${props.hue}, 100%, 50%)`,
    }} />
  )
}

export default function HuePicker(props: { hue?: number, onHueChange: (hue: number) => void }) {
  const hues = [];
  for (let i = 0; i < 360; i+= 30) {
    hues.push(i);
  }
  return (
    <ScrollView horizontal>
      <View style={{
        flexDirection: 'row',
        gap: 12,
      }}>
        {hues.map((hue) => {
          const isSelected = props.hue === hue;
          return (
            <TouchableOpacity onPress={() => props.onHueChange(hue)} key={hue}>
              <HueCircle hue={hue} isSelected={isSelected} />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
