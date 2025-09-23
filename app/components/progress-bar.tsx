import { View, Animated } from "react-native";
import { useEffect, useRef } from "react";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
  marginTop?: number; // optional prop for top margin
}

export default function ProgressBar({
  step,
  totalSteps,
  marginTop = 20, // default margin from top
}: ProgressBarProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const progress = step / totalSteps;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [step]);

  return (
    <View
      style={{
        height: 10,
        width: "100%",       
        backgroundColor: "#E0E0E0",
        marginTop: marginTop, 
      }}
    >
      <Animated.View
        style={{
          height: 10,
          width: progressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0%", "100%"],
          }),
          backgroundColor: "#722F37",
        }}
      />
    </View>
  );
}
