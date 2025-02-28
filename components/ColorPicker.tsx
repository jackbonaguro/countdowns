import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "@/styles";
function ColorCircle(props: { color: string, isSelected: boolean }) {
  const containerSize = 32;
  const circleSize = 28;
  return (
    <View style={{
      width: containerSize,
      height: containerSize,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      backgroundColor: props.isSelected ? 'white' : 'transparent',
      ...styles.shadow,
    }}>
      <View style={{
        width: circleSize,
        height: circleSize,
        borderRadius: 100,
        backgroundColor: props.color,
      }} />
    </View>
  )
}

export default function ColorPicker(props: { color?: string, onColorChange: (color: string) => void }) {
  const colors = [];
  for (let i = 0; i < 360; i+= 24) {
    colors.push(`hsl(${i}, 75%, 50%)`);
  }
  return (
    <ScrollView horizontal style={{ overflow: 'visible' }} showsHorizontalScrollIndicator={false}>
      <View style={{
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
      }}>
        {colors.map((color) => {
          const isSelected = props.color === color;
          return (
            <TouchableOpacity onPress={() => props.onColorChange(color)} key={color}>
              <ColorCircle color={color} isSelected={isSelected} />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
