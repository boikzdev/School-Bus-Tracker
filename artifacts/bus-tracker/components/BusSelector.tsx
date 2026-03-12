import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BUS_IDS, BusId, useBus } from "@/context/BusContext";
import Colors from "@/constants/colors";

const C = Colors.light;

export default function BusSelector() {
  const { selectedBus, setSelectedBus, busData } = useBus();
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={styles.trigger}
        activeOpacity={0.8}
      >
        <Ionicons name="bus" size={16} color={C.accent} />
        <Text style={styles.triggerText}>{selectedBus.replace("_", " ")}</Text>
        <Ionicons name="chevron-down" size={14} color={C.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Select a Bus</Text>
          <FlatList
            data={BUS_IDS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const coords = busData[item as BusId];
              const active = item === selectedBus;
              return (
                <TouchableOpacity
                  style={[styles.item, active && styles.itemActive]}
                  onPress={() => {
                    setSelectedBus(item as BusId);
                    setOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.busIcon, active && styles.busIconActive]}>
                    <Ionicons
                      name="bus"
                      size={20}
                      color={active ? "#fff" : C.textSecondary}
                    />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text
                      style={[styles.itemName, active && styles.itemNameActive]}
                    >
                      {item.replace("_", " ")}
                    </Text>
                    <Text style={styles.itemStatus}>
                      {coords ? "Online" : "No signal"}
                    </Text>
                  </View>
                  {active && (
                    <Ionicons name="checkmark-circle" size={20} color={C.accent} />
                  )}
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: coords ? C.success : "#ccc" },
                    ]}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  triggerText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: C.text,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    backgroundColor: C.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: "70%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: C.text,
    marginBottom: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 6,
    backgroundColor: C.background,
    gap: 12,
  },
  itemActive: {
    backgroundColor: "#EEF2FF",
  },
  busIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  busIconActive: {
    backgroundColor: C.primary,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: C.text,
  },
  itemNameActive: {
    color: C.primary,
  },
  itemStatus: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
