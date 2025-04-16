import { colors } from "@/styles";
import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const SwitcherContainer = styled.View`
  backgroundColor: ${colors.surface.secondary};
  flexDirection: row;
  borderRadius: 8px;
`;

const SwitchOption = styled.Text`
  fontWeight: bold;
  padding: 8px;
  borderRadius: 8px;
  color: ${colors.surface.tertiary};
`;

const SwitchOptionActive = styled(SwitchOption)`
  color: white;
  backgroundColor: ${colors.surface.tertiary};
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
