import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const ButtonText = styled.Text`
  color: #147EFB;
  font-size: 18px;
`;
const ButtonDisabledText = styled(ButtonText)`
  color: #ccc;
`;

const Button = React.forwardRef((props: { title: string, onPress: () => void, disabled?: boolean }, ref: React.Ref<typeof TouchableOpacity>) => {
  return (
    <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
      {props.disabled ? <ButtonDisabledText>{props.title}</ButtonDisabledText> : <ButtonText>{props.title}</ButtonText>}
    </TouchableOpacity>
  );
});

export default Button;
