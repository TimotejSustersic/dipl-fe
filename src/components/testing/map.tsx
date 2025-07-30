"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L, { DivIcon } from "leaflet";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css"; // Leaflet styles
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { MapPin } from "lucide-react";
import ReactDOMServer from "react-dom/server";
import { useEffect, useState } from "react";
import { TestingRouteDTO } from "@/schemas/testsDTO";

// import dynamic from 'next/dynamic';
// import 'leaflet/dist/leaflet.css'; // Ensure CSS is included

// // Dynamically import MapContainer and TileLayer
// const MapContainer = dynamic(
//   () => import('react-leaflet').then((mod) => mod.MapContainer),
//   { ssr: false }
// );
// const TileLayer = dynamic(
//   () => import('react-leaflet').then((mod) => mod.TileLayer),
//   { ssr: false }
// );
// const Marker = dynamic(
//   () => import('react-leaflet').then((mod) => mod.Marker),
//   { ssr: false }
// );
// const Polyline = dynamic(
//   () => import('react-leaflet').then((mod) => mod.Polyline),
//   { ssr: false }
// );

// Fix default marker icons (Next.js issue)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

type DTO = {
  data: TestingRouteDTO[];
  isLoading: boolean;
};

const TestingMap = (settings: DTO) => {
  const [isMounted, setIsMounted] = useState(false);

  const my_routes = settings.data
    .flatMap((dto) => dto.my_accumulated_routes)
    .flat();
  const my_charging_stops = settings.data.flatMap(
    (dto) => dto.my_accumulated_charging_stops
  );

  const osrm_routes = settings.data.flatMap(
    (dto) => dto.osrm_accumulated_routes
  );

  const startCoordinates = settings.data.flatMap((dto) => dto.start_coord);
  const endCoordinates = settings.data.flatMap((dto) => dto.end_coord);

  const centerStart = JSON.parse(startCoordinates[0]);
  const centerEnd = JSON.parse(endCoordinates[0]);

  // Center map roughly between start and end
  const center: [number, number] = [
    (centerStart["latitude"] + centerEnd["latitude"]) / 2, // lat
    (centerStart["longitude"] + centerEnd["longitude"]) / 2, // lon
  ];

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

  const startIcon = createLucideIcon(MapPin, "#EF4444", 40); 
  const endIcon = createLucideIcon(MapPin, "#EF4444", 40); 
  const chargeStopIcon = createLucideIcon(MapPin, "#FBBF24", 30); 

  return isMounted ? (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: "500px", width: "100%" }}
        className="rounded-lg" // Apply rounding to map itself if CardContent p-0 is used
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Start Marker */}
        {startCoordinates.map((value, index) => {
          const coord = JSON.parse(value);

          return (
            <Marker
              key={coord["latitude"] + index + coord["longitude"]}
              position={[coord["latitude"], coord["longitude"]]}
              icon={startIcon}
            />
          );
        })}

        {/* End Marker */}
        {endCoordinates.map((value, index) => {
          const coord = JSON.parse(value);

          return (
            <Marker
              key={coord["latitude"] + coord["longitude"] + index}
              position={[coord["latitude"], coord["longitude"]]}
              icon={endIcon}
            />
          );
        })}
        {/* Route Lines */}
        {my_routes.map((route, index) => (
          <div key={"#8B5CF6" + index}>
            <Polyline positions={polyline.decode(route)} color="#8B5CF6" weight={5} />
          </div>
        ))}
        {osrm_routes.map((route, index) => (
          <div key={"#2563EB" + index}>
            <Polyline
              positions={polyline.decode(route)}
              color="#2563EB"
              weight={5}
            />
          </div>
        ))}
        {/* Charging stations Lines */}
        {my_charging_stops.map((stop, index) => {
          const coord = JSON.parse(stop);

          return (
            <div key={index + coord["latitude"] +  coord["longitude"]}>
              <Marker
                position={[coord["latitude"], coord["longitude"]]}
                icon={chargeStopIcon}
              />
            </div>
          );
        })}
      </MapContainer>
      {/* Legend Box */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
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
        <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
          <MapPin color="#EF4444" size={20} />
          <span style={{ marginLeft: "8px" }}>Start / End Point</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
          <MapPin color="#FBBF24" size={20} />
          <span style={{ marginLeft: "8px" }}>Charging Station</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
          <div
            style={{
              width: "20px",
              height: "5px",
              backgroundColor: "#2563EB",
              marginRight: "8px",
              borderRadius: "2px",
            }}
          />
          <span>Original Route</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
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
      </div>
    </div>
  ) : undefined;
};

export default TestingMap;
