import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

interface DigitRollProps {
  digit: string;
  shouldAnimate: boolean;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '500' | '600' | '700';
  color?: string;
}

function DigitRoll({ 
  digit, 
  shouldAnimate,
  fontSize = 24, 
  fontWeight = 'bold',
  color = '#fff',
}: DigitRollProps) {
  const animation = useSharedValue(0);
  
  useEffect(() => {
    if (shouldAnimate) {
      animation.value = 0;
      animation.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [digit, shouldAnimate]);

  const animatedStyle = useAnimatedStyle(() => {
    if (!shouldAnimate) return {};
    
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
    <View style={[styles.container, { height: fontSize * 1.2 }]}>
      <Animated.Text 
        style={[
          { fontSize, fontWeight, color },
          animatedStyle
        ]}
      >
        {digit}
      </Animated.Text>
    </View>
  );
}

// components/NumberRoll.tsx
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
  // Keep track of previous number to determine which digits changed
  const [prevNumber, setPrevNumber] = useState(number);
  
  useEffect(() => {
    setPrevNumber(number);
  }, [number]);

  // Convert numbers to strings and pad with zeros if needed
  const currentStr = number.toString();
  const prevStr = prevNumber.toString();
  
  // Pad the shorter number with leading zeros
  const maxLength = Math.max(currentStr.length, prevStr.length);
  const paddedCurrent = currentStr.padStart(maxLength, '0');
  const paddedPrev = prevStr.padStart(maxLength, '0');

  return (
    <View style={[styles.row, style]}>
      {paddedCurrent.split('').map((digit, index) => (
        <DigitRoll
          key={`${index}-${digit}`}
          digit={digit}
          shouldAnimate={digit !== paddedPrev[index]}
          fontSize={fontSize}
          fontWeight={fontWeight}
          color={color}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
