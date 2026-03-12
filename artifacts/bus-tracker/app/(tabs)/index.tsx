import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBus } from "@/context/BusContext";
import BusSelector from "@/components/BusSelector";
import DashboardCard from "@/components/DashboardCard";
import ArrivingAlert from "@/components/ArrivingAlert";
import MapWrapper from "@/components/MapWrapper";
import Colors from "@/constants/colors";

const C = Colors.light;

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

  const busCoords = busData[selectedBus];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(simAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(simAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

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
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const initialRegion = userLocation
    ? {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 3.139,
        longitude: 101.6869,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  const topOffset = Platform.OS === "web" ? insets.top + 67 : insets.top;

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
          <View
            style={[
              styles.statusDot,
              { backgroundColor: firebaseConnected ? C.success : "#9CA3AF" },
            ]}
          />
        </View>
      </View>

      {Platform.OS !== "web" && (
        <View style={styles.mapControls}>
          <TouchableOpacity
            style={styles.mapBtn}
            onPress={centerOnUser}
            activeOpacity={0.8}
          >
            <Ionicons name="locate" size={20} color={C.primary} />
          </TouchableOpacity>
          {busCoords && (
            <TouchableOpacity
              style={styles.mapBtn}
              onPress={centerOnBus}
              activeOpacity={0.8}
            >
              <Ionicons name="bus" size={20} color={C.primary} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <View
        style={[
          styles.bottomPanel,
          {
            paddingBottom:
              Platform.OS === "web"
                ? insets.bottom + 34 + 84
                : insets.bottom + 100,
          },
        ]}
      >
        <View style={styles.panelHandle} />

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
            <Text style={styles.warningText}>
              Location permission needed to calculate distance
            </Text>
          </View>
        )}

        {!busCoords && (
          <View style={styles.warningBox}>
            <Ionicons
              name={firebaseConnected ? "cloud-offline" : "wifi-outline"}
              size={16}
              color="#6B7C93"
            />
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
          disabled={!userLocation}
        >
          {simulationMode ? (
            <Animated.View
              style={{
                opacity: simAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              }}
            >
              <View style={styles.simBtnInner}>
                <Ionicons name="stop-circle" size={18} color="#fff" />
                <Text style={styles.simBtnText}>Stop Simulation</Text>
              </View>
            </Animated.View>
          ) : (
            <View style={styles.simBtnInner}>
              <MaterialCommunityIcons
                name="bus-marker"
                size={18}
                color={C.primary}
              />
              <Text style={[styles.simBtnText, { color: C.primary }]}>
                Simulation Mode
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.background,
  },
  topBar: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  topLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  topRight: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: 4,
  },
  logoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#fff",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  mapControls: {
    position: "absolute",
    right: 16,
    bottom: 360,
    gap: 10,
    zIndex: 5,
  },
  mapBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  bottomPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: C.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
    zIndex: 5,
  },
  panelHandle: {
    width: 36,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  dashRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  warningText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#78350F",
    flex: 1,
    lineHeight: 18,
  },
  simBtn: {
    backgroundColor: "#F0F4F8",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: C.border,
  },
  simBtnActive: {
    backgroundColor: C.danger,
    borderColor: C.danger,
  },
  simBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  simBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: "#fff",
  },
});
