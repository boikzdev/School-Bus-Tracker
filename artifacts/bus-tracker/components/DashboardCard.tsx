import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

const C = Colors.light;

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
};

export default function DashboardCard({ icon, label, value, sub, accent }: Props) {
  return (
    <View style={[styles.card, accent && styles.cardAccent]}>
      <View style={[styles.iconWrap, accent && styles.iconWrapAccent]}>
        <Ionicons name={icon} size={20} color={accent ? "#fff" : C.accent} />
      </View>
      <Text style={[styles.label, accent && styles.labelAccent]}>{label}</Text>
      <Text style={[styles.value, accent && styles.valueAccent]}>{value}</Text>
      {sub ? (
        <Text style={[styles.sub, accent && styles.subAccent]}>{sub}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 16,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardAccent: {
    backgroundColor: C.primary,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  iconWrapAccent: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  label: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: C.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  labelAccent: {
    color: "rgba(255,255,255,0.65)",
  },
  value: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: C.text,
  },
  valueAccent: {
    color: "#FFFFFF",
  },
  sub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 2,
  },
  subAccent: {
    color: "rgba(255,255,255,0.55)",
  },
});
