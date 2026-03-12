import React from "react";
import MapView, { Marker, PROVIDER_DEFAULT, Circle } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { CITY_CENTER } from "@/context/BusContext";

const C = Colors.light;

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type BusCoords = { lat: number; lng: number } | null;

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapRef: React.RefObject<any>;
  initialRegion: Region;
  showUserLocation: boolean;
  busCoords: BusCoords;
  busLabel: string;
  distanceLabel: string;
};

export default function MapWrapper({
  mapRef,
  initialRegion,
  showUserLocation,
  busCoords,
  busLabel,
  distanceLabel,
}: Props) {
  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      provider={PROVIDER_DEFAULT}
      initialRegion={initialRegion}
      showsUserLocation={showUserLocation}
      showsMyLocationButton={false}
      showsCompass={false}
    >
      <Marker
        coordinate={{ latitude: CITY_CENTER.lat, longitude: CITY_CENTER.lng }}
        title="City Center"
        description="Fixed destination"
        anchor={{ x: 0.5, y: 0.5 }}
      >
        <View style={styles.cityMarker}>
          <Ionicons name="location" size={18} color="#fff" />
        </View>
      </Marker>

      <Circle
        center={{ latitude: CITY_CENTER.lat, longitude: CITY_CENTER.lng }}
        radius={1000}
        strokeColor="rgba(245,166,35,0.5)"
        fillColor="rgba(245,166,35,0.08)"
        strokeWidth={2}
      />

      {busCoords && (
        <Marker
          coordinate={{ latitude: busCoords.lat, longitude: busCoords.lng }}
          title={busLabel}
          description={distanceLabel}
        >
          <View style={styles.busMarker}>
            <Ionicons name="bus" size={22} color="#fff" />
          </View>
        </Marker>
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  cityMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  busMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: C.accent,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
});
