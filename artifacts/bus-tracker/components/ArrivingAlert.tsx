import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

const C = Colors.light;

type Props = {
  distance: number;
};

export default function ArrivingAlert({ distance }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    return () => loop.stop();
  }, []);

  const distM = Math.round(distance);
  const distText = distM < 1000 ? `${distM}m` : `${(distM / 1000).toFixed(1)}km`;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Animated.View style={[styles.card, { transform: [{ scale: pulse }] }]}>
        <View style={styles.iconCircle}>
          <Ionicons name="bus" size={32} color="#fff" />
        </View>
        <Text style={styles.headline}>BUS IS ARRIVING</Text>
        <Text style={styles.sub}>Your bus is only {distText} away!</Text>
        <View style={styles.pill}>
          <Ionicons name="location" size={12} color={C.danger} />
          <Text style={styles.pillText}>Be at your stop now</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(231, 76, 60, 0.92)",
    zIndex: 999,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 32,
    alignItems: "center",
    marginHorizontal: 32,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.danger,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  headline: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    color: C.danger,
    letterSpacing: 0.5,
    textAlign: "center",
    marginBottom: 8,
  },
  sub: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: C.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: C.danger,
  },
});
