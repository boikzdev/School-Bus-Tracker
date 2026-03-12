import React from "react";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

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
