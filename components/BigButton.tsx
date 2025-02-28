import { styles } from "@/styles";
import { Text, TouchableOpacity } from "react-native";

export default function BigButton(props: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      style={{
        padding: 16,
        backgroundColor: props.disabled ? 'gray' : 'green',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        ...styles.shadow,
      }}
      onPress={props.onPress}
    >
    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{props.title}</Text>
  </TouchableOpacity>
  )
}
