import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import SVG, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';

const StepRingProgress = ({ radius = 100, strokeWidth = 20, progress }) => {
  const color = "#000";
  const strokeColor = "#EE0F55"; // Stroke color for both circles
  const innerRadius = radius - strokeWidth / 2; // Ensure the inner radius is correct
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(progress, {duration: 1500 });
  }, [progress])

  const circumference = 2 * Math.PI * innerRadius;

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [circumference * fill.value, circumference]

  }))

  return (
    <View style={{ width: radius * 2, height: radius * 2, alignSelf: "center" }}>
      <SVG width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        {/* Background Circle */}
        <Circle
          cx={radius}
          cy={radius}
          r={innerRadius} // Use innerRadius to match the radius of the foreground circle
          fill={color}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          opacity={0.2}
        />
        {/* Foreground Circle (Progress Circle) */}
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={radius}
          cy={radius}
          r={innerRadius} // Use the same radius as the background circle
          fill={color}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          rotation="-90"
          originX={radius}
          originY={radius}
        />
      </SVG>
      <AntDesign name="arrowright" size={strokeWidth * 0.8} color="black" style={{position: 'absolute', alignSelf: 'center', top: strokeWidth * 0.1 }} />
    </View>
  );
};

export default StepRingProgress;

const styles = StyleSheet.create({});
