import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBus, CITY_CENTER } from "@/context/BusContext";
import BusSelector from "@/components/BusSelector";
import DashboardCard from "@/components/DashboardCard";
import ArrivingAlert from "@/components/ArrivingAlert";
import MapWrapper from "@/components/MapWrapper";
import Colors from "@/constants/colors";

const C = Colors.light;
const { height: SCREEN_H } = Dimensions.get("window");

const PANEL_CONTENT_H = 300;
const PEEK_H = 72;
const HIDE_OFFSET = PANEL_CONTENT_H - PEEK_H;

export default function TrackScreen() {
  const {
    selectedBus,
    busData,
    userLocation,
    locationPermission,
    distance,
    eta,
    isArriving,
    simulationMode,
    toggleSimulation,
    firebaseConnected,
  } = useBus();

  const insets = useSafeAreaInsets();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const simAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);
  const [expanded, setExpanded] = useState(true);

  const busCoords = busData[selectedBus];

  useEffect(() => {
    const id = slideAnim.addListener(({ value }) => {
      currentOffset.current = value;
    });
    return () => slideAnim.removeListener(id);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(simAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(simAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const snapTo = (target: "expanded" | "minimized") => {
    const toValue = target === "expanded" ? 0 : HIDE_OFFSET;
    setExpanded(target === "expanded");
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      tension: 60,
      friction: 12,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 4,
      onPanResponderGrant: () => {
        slideAnim.setOffset(currentOffset.current);
        slideAnim.setValue(0);
      },
      onPanResponderMove: (_, gs) => {
        const next = Math.max(0, Math.min(HIDE_OFFSET, gs.dy));
        slideAnim.setValue(next);
      },
      onPanResponderRelease: (_, gs) => {
        slideAnim.flattenOffset();
        const current = currentOffset.current;
        if (gs.vy > 0.4 || (gs.dy > 40 && current > HIDE_OFFSET * 0.3)) {
          snapTo("minimized");
        } else if (gs.vy < -0.4 || (gs.dy < -40 && current < HIDE_OFFSET * 0.7)) {
          snapTo("expanded");
        } else {
          snapTo(current < HIDE_OFFSET / 2 ? "expanded" : "minimized");
        }
      },
    })
  ).current;

  const formatDistance = (d: number | null) => {
    if (d === null) return "--";
    if (d < 1000) return `${Math.round(d)} m`;
    return `${(d / 1000).toFixed(2)} km`;
  };

  const formatEta = (e: number | null) => {
    if (e === null) return "--";
    if (e === 0) return "< 1 min";
    return `${e} min`;
  };

  const centerOnBus = () => {
    if (busCoords && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: busCoords.lat,
        longitude: busCoords.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const centerOnUser = () => {
    if (mapRef.current) {
      const lat = userLocation ? userLocation.coords.latitude : CITY_CENTER.lat;
      const lng = userLocation ? userLocation.coords.longitude : CITY_CENTER.lng;
      mapRef.current.animateToRegion({ latitude: lat, longitude: lng, latitudeDelta: 0.01, longitudeDelta: 0.01 });
    }
  };

  const centerOnCity = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: CITY_CENTER.lat, longitude: CITY_CENTER.lng,
        latitudeDelta: 0.08, longitudeDelta: 0.08,
      });
    }
  };

  const initialRegion = {
    latitude: CITY_CENTER.lat,
    longitude: CITY_CENTER.lng,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  };

  const topOffset = Platform.OS === "web" ? insets.top + 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? insets.bottom + 34 + 84 : insets.bottom;

  const mapControlsBottom = slideAnim.interpolate({
    inputRange: [0, HIDE_OFFSET],
    outputRange: [PANEL_CONTENT_H + bottomInset + 12, PEEK_H + bottomInset + 12],
    extrapolate: "clamp",
  });

  const contentOpacity = slideAnim.interpolate({
    inputRange: [0, HIDE_OFFSET * 0.5],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const miniOpacity = slideAnim.interpolate({
    inputRange: [HIDE_OFFSET * 0.5, HIDE_OFFSET],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.root}>
      {isArriving && distance !== null && <ArrivingAlert distance={distance} />}

      <MapWrapper
        mapRef={mapRef}
        initialRegion={initialRegion}
        showUserLocation={locationPermission}
        busCoords={busCoords}
        busLabel={selectedBus.replace("_", " ")}
        distanceLabel={distance !== null ? `${formatDistance(distance)} away` : ""}
      />

      <View style={[styles.topBar, { top: topOffset + 12 }]}>
        <View style={styles.topLeft}>
          <View style={styles.logoChip}>
            <Ionicons name="bus" size={16} color={C.accent} />
            <Text style={styles.logoText}>BusTrack</Text>
          </View>
        </View>
        <BusSelector />
        <View style={styles.topRight}>
          <View style={[styles.statusDot, { backgroundColor: firebaseConnected ? C.success : "#9CA3AF" }]} />
        </View>
      </View>

      {Platform.OS !== "web" && (
        <Animated.View style={[styles.mapControls, { bottom: mapControlsBottom }]}>
          <TouchableOpacity style={styles.mapBtn} onPress={centerOnUser} activeOpacity={0.8}>
            <Ionicons name="locate" size={20} color={C.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mapBtn} onPress={centerOnCity} activeOpacity={0.8}>
            <Ionicons name="location" size={20} color={C.accent} />
          </TouchableOpacity>
          {busCoords && (
            <TouchableOpacity style={styles.mapBtn} onPress={centerOnBus} activeOpacity={0.8}>
              <Ionicons name="bus" size={20} color={C.primary} />
            </TouchableOpacity>
          )}
        </Animated.View>
      )}

      <Animated.View
        style={[
          styles.bottomPanel,
          { paddingBottom: bottomInset, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View {...panResponder.panHandlers} style={styles.handleArea}>
          <View style={styles.panelHandle} />

          <Animated.View style={[styles.miniRow, { opacity: miniOpacity }]} pointerEvents={expanded ? "none" : "auto"}>
            <View style={styles.miniLeft}>
              <Ionicons name="bus" size={14} color={C.accent} />
              <Text style={styles.miniTitle}>{selectedBus.replace("_", " ")}</Text>
            </View>
            <View style={styles.miniStats}>
              <View style={styles.miniStat}>
                <Ionicons name="navigate" size={12} color={C.primary} />
                <Text style={styles.miniStatVal}>{formatDistance(distance)}</Text>
              </View>
              <View style={styles.miniDivider} />
              <View style={styles.miniStat}>
                <Ionicons name="time" size={12} color={C.textSecondary} />
                <Text style={styles.miniStatVal}>{formatEta(eta)}</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        <Animated.View style={{ opacity: contentOpacity }} pointerEvents={expanded ? "auto" : "none"}>
          <View style={styles.dashRow}>
            <DashboardCard
              icon="navigate"
              label="Distance"
              value={formatDistance(distance)}
              sub={busCoords ? "Live tracking" : "No signal"}
              accent
            />
            <View style={{ width: 12 }} />
            <DashboardCard
              icon="time"
              label="Est. Arrival"
              value={formatEta(eta)}
              sub={eta !== null ? "at 30 km/h" : "Waiting for data"}
            />
          </View>

          {!locationPermission && (
            <View style={styles.warningBox}>
              <Ionicons name="warning" size={16} color="#B45309" />
              <Text style={styles.warningText}>Location permission needed to calculate distance</Text>
            </View>
          )}

          {!busCoords && (
            <View style={styles.warningBox}>
              <Ionicons name={firebaseConnected ? "cloud-offline" : "wifi-outline"} size={16} color="#6B7C93" />
              <Text style={styles.warningText}>
                {firebaseConnected
                  ? `No GPS data for ${selectedBus.replace("_", " ")} yet`
                  : "Update config/firebase.ts with your credentials"}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.simBtn, simulationMode && styles.simBtnActive]}
            onPress={toggleSimulation}
            activeOpacity={0.85}
          >
            {simulationMode ? (
              <Animated.View style={{ opacity: simAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }}>
                <View style={styles.simBtnInner}>
                  <Ionicons name="stop-circle" size={18} color="#fff" />
                  <Text style={styles.simBtnText}>Stop Simulation</Text>
                </View>
              </Animated.View>
            ) : (
              <View style={styles.simBtnInner}>
                <MaterialCommunityIcons name="bus-marker" size={18} color={C.primary} />
                <Text style={[styles.simBtnText, { color: C.primary }]}>Simulation Mode</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  topBar: {
    position: "absolute",
    left: 16, right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  topLeft: { flex: 1, alignItems: "flex-start" },
  topRight: { flex: 1, alignItems: "flex-end", paddingRight: 4 },
  logoChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.primary, paddingHorizontal: 12,
    paddingVertical: 8, borderRadius: 20,
  },
  logoText: { fontFamily: "Inter_700Bold", fontSize: 14, color: "#fff" },
  statusDot: {
    width: 10, height: 10, borderRadius: 5,
    borderWidth: 2, borderColor: "#fff",
    shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  mapControls: {
    position: "absolute",
    right: 16,
    gap: 10,
    zIndex: 5,
  },
  mapBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: C.card,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.1,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  bottomPanel: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    height: PANEL_CONTENT_H + 120,
    backgroundColor: C.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    shadowColor: "#000", shadowOpacity: 0.14,
    shadowRadius: 16, shadowOffset: { width: 0, height: -4 },
    elevation: 14, zIndex: 5,
  },
  handleArea: {
    paddingTop: 10,
    paddingBottom: 8,
    alignItems: "center",
    cursor: "grab" as unknown as undefined,
  },
  panelHandle: {
    width: 36, height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    marginBottom: 8,
  },
  miniRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingBottom: 4,
    height: 36,
  },
  miniLeft: {
    flexDirection: "row", alignItems: "center", gap: 6,
  },
  miniTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14, color: C.text,
  },
  miniStats: {
    flexDirection: "row", alignItems: "center", gap: 8,
  },
  miniStat: {
    flexDirection: "row", alignItems: "center", gap: 4,
  },
  miniStatVal: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13, color: C.text,
  },
  miniDivider: {
    width: 1, height: 14,
    backgroundColor: C.border,
  },
  dashRow: {
    flexDirection: "row",
    marginBottom: 14,
    marginTop: 4,
  },
  warningBox: {
    flexDirection: "row", alignItems: "flex-start",
    gap: 8, backgroundColor: "#FFFBEB",
    borderRadius: 12, padding: 12, marginBottom: 12,
    borderWidth: 1, borderColor: "#FDE68A",
  },
  warningText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13, color: "#78350F",
    flex: 1, lineHeight: 18,
  },
  simBtn: {
    backgroundColor: "#F0F4F8",
    borderRadius: 14, paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5, borderColor: C.border,
  },
  simBtnActive: {
    backgroundColor: C.danger,
    borderColor: C.danger,
  },
  simBtnInner: {
    flexDirection: "row", alignItems: "center", gap: 8,
  },
  simBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15, color: "#fff",
  },
});
