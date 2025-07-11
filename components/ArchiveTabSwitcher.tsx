import { colors } from "@/styles";
import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const IOS_BLUE = '#147EFB';
const makeIOSBlue = (transparency: number): string => {
  return `rgba(20, 126, 251, ${transparency})`;
}

const SwitcherContainer = styled.View`
  xbackgroundColor: ${colors.surface.secondary};
  backgroundColor: ${makeIOSBlue(.13)};
  flexDirection: row;
  borderRadius: 8px;
`;

const SwitchOption = styled.Text`
  fontWeight: bold;
  padding: 8px;
  borderRadius: 8px;
  xcolor: ${colors.surface.tertiary};
  color: ${IOS_BLUE};
`;

const SwitchOptionActive = styled(SwitchOption)`
  color: white;
  xbackgroundColor: ${colors.surface.tertiary};
  backgroundColor: ${IOS_BLUE};
`;

const ArchiveTabSwitcher = (props: {
  archived: boolean;
  onChange: (_: boolean) => void;
}) => {
  const ActiveOption = props.archived ? SwitchOption : SwitchOptionActive;
  const ArchiveOption = props.archived ? SwitchOptionActive : SwitchOption;

  const onChange = (value: boolean) => {
    if (props.archived !== value) {
      props.onChange(value);
    }
  }

  return (
    <SwitcherContainer>
      <TouchableOpacity onPress={() => onChange(false)}>
        <ActiveOption>Active</ActiveOption>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onChange(true)}>
        <ArchiveOption>Archived</ArchiveOption>
      </TouchableOpacity>
    </SwitcherContainer>
  );
};

export default ArchiveTabSwitcher;
