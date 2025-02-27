import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

interface NumberRollProps {
  number: number;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '500' | '600' | '700';
  color?: string;
  style?: any;
}

export function NumberRoll({ 
  number, 
  fontSize = 24, 
  fontWeight = 'bold',
  color = '#fff',
  style 
}: NumberRollProps) {
  const animation = useSharedValue(0);
  
  useEffect(() => {
    // Reset animation value to trigger new animation
    animation.value = 0;
    animation.value = withSpring(1, {
      damping: 300,
      stiffness: 500,
    });
  }, [number]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateY: interpolate(
            animation.value,
            [0, 1],
            [fontSize, 0]
          ) 
        },
        { 
          scale: interpolate(
            animation.value,
            [0, 0.5, 1],
            [0.8, 1.1, 1]
          ) 
        }
      ],
      opacity: interpolate(
        animation.value,
        [0, 0.5, 1],
        [0, 1, 1]
      )
    };
  });

  return (
    <View style={[styles.container, { height: fontSize * 1.2 }, style]}>
      <Animated.Text 
        style={[
          { fontSize, fontWeight, color },
          animatedStyle
        ]}
      >
        {number}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
