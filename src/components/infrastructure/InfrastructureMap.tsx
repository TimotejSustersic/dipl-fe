"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L, { DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet styles
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { MapPin } from "lucide-react";
import ReactDOMServer from "react-dom/server";
import { useEffect, useState } from "react";

// Fix default marker icons (Next.js issue)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

type DTO = {
  isLoading: boolean;
  empty_battery_locations: string[];
  charging_stations: string[];
  userMarkers?: Array<{ latitude: number; longitude: number }>;
  addUserMarker?: (lat: number, lng: number) => void;
  removeUserMarker?: (index: number) => void;
};

const ClickHandler = ({ addUserMarker }: { addUserMarker?: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      if (addUserMarker) {
        addUserMarker(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

const InfrastructureMap = (settings: DTO) => {
  const [isMounted, setIsMounted] = useState(false);

  const center = settings.empty_battery_locations.length ? JSON.parse(settings.empty_battery_locations[0]) : [46.046,14.496];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (settings.isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <Skeleton className="h-[500px] w-full rounded-md bg-gray-300 opacity-100" />
        </CardContent>
      </Card>
    );
  }

  const createLucideIcon = (
    IconComponent: React.ElementType,
    color: string,
    size: number = 24
  ): DivIcon => {
    const iconHtml = ReactDOMServer.renderToString(
      <IconComponent color={color} size={size} />
    );
    return L.divIcon({
      html: iconHtml,
      className: "bg-transparent border-none", // important for divIcon
      iconSize: [size, size],
      iconAnchor: [size / 2, size], // anchor point
    });
  };

  const chargeStopIcon = createLucideIcon(MapPin, "red", 30); // Secondary Purple
  const userMarkerIcon = createLucideIcon(MapPin, "green", 30); // Green for user markers

  return isMounted ? (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: "500px", width: "100%" }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Charging stations */}
      {settings.charging_stations.map((stop, index) => {
        const coord = JSON.parse(stop);
        return (
          <Marker
            key={`charge-stop-${index}`}
            position={[coord.latitude, coord.longitude]}
            icon={chargeStopIcon}
          />
        );
      })}

      {/* Empty battery locations */}
      {settings.empty_battery_locations.map((stop, index) => {
        const coord = JSON.parse(stop);
        return (
          <Marker
            key={`empty-battery-${index}`}
            position={[coord.latitude, coord.longitude]}
            icon={chargeStopIcon}
          />
        );
      })}

      {/* User added markers */}
      {settings.userMarkers?.map((marker, index) => (
        <Marker
          key={`user-marker-${index}`}
          position={[marker.latitude, marker.longitude]}
          icon={userMarkerIcon}
          eventHandlers={{
            click: () => {
              if (settings.removeUserMarker) {
                settings.removeUserMarker(index);
              }
            },
          }}
        />
      ))}

      {/* Click handler to add markers */}
      {settings.addUserMarker && <ClickHandler addUserMarker={settings.addUserMarker} />}
    </MapContainer>
  ) : null;
};

export default InfrastructureMap;
