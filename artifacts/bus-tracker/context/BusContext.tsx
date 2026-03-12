import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { ref, onValue, set } from "firebase/database";
import * as Location from "expo-location";
import { database } from "@/config/firebase";

export type BusId =
  | "Bus_01"
  | "Bus_02"
  | "Bus_03"
  | "Bus_04"
  | "Bus_05"
  | "Bus_06"
  | "Bus_07"
  | "Bus_08";

export const BUS_IDS: BusId[] = [
  "Bus_01",
  "Bus_02",
  "Bus_03",
  "Bus_04",
  "Bus_05",
  "Bus_06",
  "Bus_07",
  "Bus_08",
];

export type BusCoords = {
  lat: number;
  lng: number;
};

export type BusData = Record<BusId, BusCoords | null>;

type BusContextType = {
  selectedBus: BusId;
  setSelectedBus: (id: BusId) => void;
  busData: BusData;
  userLocation: Location.LocationObject | null;
  locationPermission: boolean;
  distance: number | null;
  eta: number | null;
  isArriving: boolean;
  simulationMode: boolean;
  toggleSimulation: () => void;
  firebaseConnected: boolean;
};

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const initialBusData: BusData = Object.fromEntries(
  BUS_IDS.map((id) => [id, null])
) as BusData;

const BusContext = createContext<BusContextType | null>(null);

export function BusProvider({ children }: { children: React.ReactNode }) {
  const [selectedBus, setSelectedBus] = useState<BusId>("Bus_01");
  const [busData, setBusData] = useState<BusData>(initialBusData);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermission(true);
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setUserLocation(loc);

        Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 10 },
          (loc) => setUserLocation(loc)
        );
      }
    })();
  }, []);

  useEffect(() => {
    try {
      const unsubscribers = BUS_IDS.map((busId) => {
        const busRef = ref(database, `buses/${busId}`);
        return onValue(
          busRef,
          (snapshot) => {
            const data = snapshot.val();
            setFirebaseConnected(true);
            if (data && typeof data.lat === "number" && typeof data.lng === "number") {
              setBusData((prev) => ({ ...prev, [busId]: data }));
            } else {
              setBusData((prev) => ({ ...prev, [busId]: null }));
            }
          },
          () => {
            setFirebaseConnected(false);
          }
        );
      });
      return () => unsubscribers.forEach((unsub) => unsub());
    } catch {
      setFirebaseConnected(false);
    }
  }, []);

  const toggleSimulation = useCallback(() => {
    setSimulationMode((prev) => {
      const next = !prev;
      if (next && userLocation) {
        let step = 0;
        const totalSteps = 30;
        const startLat = userLocation.coords.latitude + 0.05;
        const startLng = userLocation.coords.longitude + 0.05;
        const endLat = userLocation.coords.latitude;
        const endLng = userLocation.coords.longitude;

        if (simIntervalRef.current) clearInterval(simIntervalRef.current);

        simIntervalRef.current = setInterval(async () => {
          if (step > totalSteps) {
            if (simIntervalRef.current) clearInterval(simIntervalRef.current);
            return;
          }
          const t = step / totalSteps;
          const simLat = startLat + (endLat - startLat) * t;
          const simLng = startLng + (endLng - startLng) * t;

          try {
            await set(ref(database, `buses/${selectedBus}`), {
              lat: simLat,
              lng: simLng,
            });
          } catch {
            setBusData((prev) => ({
              ...prev,
              [selectedBus]: { lat: simLat, lng: simLng },
            }));
          }
          step++;
        }, 1000);
      } else {
        if (simIntervalRef.current) {
          clearInterval(simIntervalRef.current);
          simIntervalRef.current = null;
        }
      }
      return next;
    });
  }, [userLocation, selectedBus]);

  useEffect(() => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
      setSimulationMode(false);
    }
  }, [selectedBus]);

  const busCoords = busData[selectedBus];
  const distance =
    userLocation && busCoords
      ? haversineDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          busCoords.lat,
          busCoords.lng
        )
      : null;

  const isArriving = distance !== null && distance <= 1000;
  const BUS_SPEED_MPS = 8.33;
  const eta =
    distance !== null ? Math.max(0, Math.round(distance / BUS_SPEED_MPS / 60)) : null;

  return (
    <BusContext.Provider
      value={{
        selectedBus,
        setSelectedBus,
        busData,
        userLocation,
        locationPermission,
        distance,
        eta,
        isArriving,
        simulationMode,
        toggleSimulation,
        firebaseConnected,
      }}
    >
      {children}
    </BusContext.Provider>
  );
}

export function useBus() {
  const ctx = useContext(BusContext);
  if (!ctx) throw new Error("useBus must be used within BusProvider");
  return ctx;
}
