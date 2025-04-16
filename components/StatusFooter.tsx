import useAPIStatus, { APIStatus } from "@/hooks/useAPIStatus";
import { colors } from "@/styles";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;
const LabelText = styled.Text`
  color: ${colors.text.secondary};
`;
const Indicator = styled.View`
  width: 14px;
  height: 14px;
  border-radius: 100px;
`;

const StatusFooter = (props: {
  onPress?: () => void;
}) => {
  const { status, refetch } = useAPIStatus();

  return (
    <TouchableOpacity onPress={props.onPress || refetch}>
      <Container>
        <LabelText>API Status</LabelText>
        <Indicator style={{
          backgroundColor: {
            [APIStatus.LOADING]: colors.yellow,
            [APIStatus.UP]: colors.green,
            [APIStatus.DOWN]: colors.red,
          }[status],
        }} />
      </Container>
    </TouchableOpacity>
  )
};

export default StatusFooter;
