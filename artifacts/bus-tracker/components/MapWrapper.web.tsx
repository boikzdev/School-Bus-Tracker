import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

const C = Colors.light;

type Props = {
  mapRef?: unknown;
  initialRegion?: unknown;
  showUserLocation?: boolean;
  busCoords?: { lat: number; lng: number } | null;
  busLabel?: string;
  distanceLabel?: string;
};

export default function MapWrapper({ busCoords, busLabel, distanceLabel }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Ionicons name="map" size={48} color={C.accent} />
        <Text style={styles.title}>Map Preview</Text>
        <Text style={styles.sub}>Live map is available in the Expo Go mobile app.</Text>
        {busCoords && (
          <View style={styles.busInfo}>
            <Ionicons name="bus" size={16} color="#fff" />
            <Text style={styles.busLabel}>{busLabel}</Text>
            <Text style={styles.busDistance}>{distanceLabel}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#D1E8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: C.primary,
  },
  sub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: C.textSecondary,
    textAlign: "center",
    maxWidth: 260,
  },
  busInfo: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  busLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },
  busDistance: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
});
