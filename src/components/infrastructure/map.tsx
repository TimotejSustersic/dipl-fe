"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import L, { DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet styles
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { MapPin } from "lucide-react";
import ReactDOMServer from "react-dom/server";
import { useEffect, useState } from "react";
import polyline from "@mapbox/polyline";
import { TestingRouteDTO, TestInstanceRouteDTO } from "@/schemas/testsDTO";

// Fix default marker icons (Next.js issue)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

type DTO = {
  routes: Array<TestInstanceRouteDTO | TestingRouteDTO>;
  isLoading: boolean;
  empty_battery_locations: string[];
  charging_stations: string[];
  userMarkers?: Array<{ latitude: number; longitude: number }>;
  addUserMarker?: (lat: number, lng: number) => void;
  removeUserMarker?: (index: number) => void;
};

const ClickHandler = ({
  addUserMarker,
}: {
  addUserMarker?: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      if (addUserMarker) {
        addUserMarker(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

const Map = (settings: DTO) => {
  const [isMounted, setIsMounted] = useState(false);

  const center = settings.empty_battery_locations.length
    ? JSON.parse(settings.empty_battery_locations[0])
    : [46.046, 14.496];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // if (settings.isLoading) {
  //   return (
  //     <Card>
  //       <CardContent className="p-0">
  //         <Skeleton className="h-[500px] w-full rounded-md bg-gray-300 opacity-100" />
  //       </CardContent>
  //     </Card>
  //   );
  // }

  const my_routes = settings.routes.flatMap((dto: any) =>
    dto.test_route
      ? dto.test_route.my_accumulated_routes
      : dto.my_accumulated_routes
  );
  const my_charging_stops = settings.routes.flatMap((dto: any) =>
    dto.test_route
      ? dto.test_route.my_accumulated_charging_stops
      : dto.my_accumulated_charging_stops
  );

  const new_routes = (settings.routes as any).new_accumulated_routes
    ? settings.routes.flatMap((dto: any) =>
        dto.new_accumulated_routes ? dto.new_accumulated_routes : undefined
      )
    : [];
  const new_charging_stops = (settings.routes as any)
    .new_accumulated_charging_stops
    ? settings.routes.flatMap((dto: any) =>
        dto.new_accumulated_charging_stops
          ? dto.new_accumulated_charging_stops
          : undefined
      )
    : [];

  const osrm_routes = settings.routes.flatMap((dto: any) =>
    dto.test_route
      ? dto.test_route.osrm_accumulated_routes
      : dto.osrm_accumulated_routes
  );

  const startCoordinates = settings.routes.map((dto: any) =>
    dto.test_route ? dto.test_route.start_coord : dto.start_coord
  );
  const endCoordinates = settings.routes.map((dto: any) =>
    dto.test_route ? dto.test_route.end_coord : dto.end_coord
  );

  // const center = settings.empty_battery_locations.length
  //   ? JSON.parse(settings.empty_battery_locations[0])
  //   : [46.046, 14.496];

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

  const startIcon = createLucideIcon(MapPin, "#EF4444", 40);
  const endIcon = createLucideIcon(MapPin, "#EF4444", 40);
  const chargeStopIcon = createLucideIcon(MapPin, "#FBBF24", 30);
  const newChargeStopIcon = createLucideIcon(MapPin, "#14B8A6", 30);
  const emptyBattery = createLucideIcon(MapPin, "#4B5563", 30);
  const userMarkerIcon = createLucideIcon(MapPin, "green", 30);

  return isMounted ? (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={[46.046, 14.496]}
        zoom={10}
        style={{ height: "670px", width: "100%" }}
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
              icon={emptyBattery}
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
        {/* Start Marker */}
        {startCoordinates.map((value, index) => {
          const coord = JSON.parse(value);

          return (
            <Marker
              key={index}
              position={[coord.latitude, coord.longitude]}
              icon={startIcon}
            />
          );
        })}

        {/* End Marker */}
        {endCoordinates.map((value, index) => {
          const coord = JSON.parse(value);

          return (
            <Marker
              key={index}
              position={[coord.latitude, coord.longitude]}
              icon={endIcon}
            />
          );
        })}
        {/* Route Lines */}
        {my_routes.map((route, index) => (
          <div key={index}>
            <Polyline
              positions={polyline.decode(route)}
              color="#8B5CF6"
              weight={5}
            />
          </div>
        ))}
        {/* Route Lines */}
        {new_routes.map((geometry, index) => (
          <div key={index}>
            <Polyline
              positions={polyline.decode(geometry)}
              color="red"
              weight={5}
            />
          </div>
        ))}
        {/* Route Lines */}
        {osrm_routes.map((geometry, index) => (
          <div key={index}>
            <Polyline
              positions={polyline.decode(geometry)}
              color="oklch(54.6% 0.245 262.881)"
              weight={5}
            />
          </div>
        ))}
        {/* Charging stations Lines */}
        {my_charging_stops.map((stop, index) => {
          const coord = JSON.parse(stop);

          return (
            <div key={index}>
              <Marker
                position={[coord["latitude"], coord["longitude"]]}
                icon={chargeStopIcon}
              />
            </div>
          );
        })}
        {/* Charging stations Lines */}
        {new_charging_stops.map((stop, index) => {
          const coord = JSON.parse(stop);

          return (
            <div key={index}>
              <Marker
                position={[coord["latitude"], coord["longitude"]]}
                icon={newChargeStopIcon}
              />
            </div>
          );
        })}
        {/* Click handler to add markers */}
        {settings.addUserMarker && (
          <ClickHandler addUserMarker={settings.addUserMarker} />
        )}
      </MapContainer>
      {/* Legend Box */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          zIndex: 1000,
          width: "200px",
          fontSize: "14px",
          color: "#333",
        }}
      >
        <h4 style={{ marginBottom: "8px", fontWeight: "bold" }}>Map Legend</h4>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}
        >
          <MapPin color="#EF4444" size={20} />
          <span style={{ marginLeft: "8px" }}>Start / End Point</span>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}
        >
          <MapPin color="#FBBF24" size={20} />
          <span style={{ marginLeft: "8px" }}>Charging Station</span>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}
        >
          <MapPin color="#4B5563" size={20} />
          <span style={{ marginLeft: "8px" }}>Empty Battery Location</span>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}
        >
          <MapPin color="green" size={20} />
          <span style={{ marginLeft: "8px" }}>Proposed Charging Station</span>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}
        >
          <MapPin color="#14B8A6" size={20} />
          <span style={{ marginLeft: "8px" }}>New Charging Station</span>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}
        >
          <div
            style={{
              width: "20px",
              height: "5px",
              backgroundColor: "oklch(54.6% 0.245 262.881)",
              marginRight: "8px",
              borderRadius: "2px",
            }}
          />
          <span>Original Route</span>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}
        >
          <div
            style={{
              width: "20px",
              height: "5px",
              backgroundColor: "#8B5CF6",
              marginRight: "8px",
              borderRadius: "2px",
            }}
          />
          <span>Proposed Route</span>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}
        >
          <div
            style={{
              width: "20px",
              height: "5px",
              backgroundColor: "red",
              marginRight: "8px",
              borderRadius: "2px",
            }}
          />
          <span>New Route</span>
        </div>
      </div>
    </div>
  ) : null;
};

export default Map;
