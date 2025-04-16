import { colors, styles } from "@/styles";
import { TouchableWithoutFeedback, View } from "react-native";
import styled from "styled-components/native";

const Text = styled.Text`
  color: ${colors.text.secondary};
  font-size: ${styles.fontSize.small};
  font-weight: 700;
`;
export default function SortToggle(props: {
  label?: string;
  onPress: () => void;
  ascending: boolean;
}) {
  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
    >
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          alignItems: 'center',
        }}
      >
        {props.label && <Text>{props.label}</Text>}
        <Text>{props.ascending ? '↑' : '↓'}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}
