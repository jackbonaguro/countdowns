import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Platform, Modal as RNModal, SafeAreaView, StatusBar, View, Animated } from "react-native";

function IOSModal(props: PropsWithChildren & {
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

function AndroidModal(props: PropsWithChildren & {
  visible: boolean;
}) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (props.visible) {
      setShouldRender(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
      });
    }
  }, [props.visible, slideAnim]);

  if (!shouldRender) {
    return null;
  }

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
    }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Animated.View style={{
        flex: 1,
        transform: [{
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1000, 0],
          })
        }]
      }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
          {props.children}
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

export default function Modal(props: PropsWithChildren & {
  visible: boolean;
}) {
  return Platform.OS === 'ios' ? <IOSModal {...props} /> : <AndroidModal {...props} />;
}
