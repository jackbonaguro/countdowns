import { PropsWithChildren } from "react";
import { Modal as RNModal, SafeAreaView } from "react-native";

export default function Modal(props: PropsWithChildren & {
  visible: boolean;
}) {
  return (
    <RNModal
      visible={props.visible}
      animationType="slide"
    >
      <SafeAreaView style={{ flex: 1 }}>
        {props.children}
      </SafeAreaView>
    </RNModal>
  )
}
