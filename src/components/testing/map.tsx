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

  const startIcon = createLucideIcon(MapPin, "#9b87f5", 40); // Sky Blue
  const endIcon = createLucideIcon(MapPin, "#9b87f5", 40); // Primary Purple
  const chargeStopIcon = createLucideIcon(MapPin, "red", 30); // Secondary Purple

  return isMounted ? (
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
      {startCoordinates.map((value) => {
        const coord = JSON.parse(value);

        return (
          <Marker
            position={[coord["latitude"], coord["longitude"]]}
            icon={startIcon}
          />
        );
      })}

      {/* End Marker */}
      {endCoordinates.map((value) => {
        const coord = JSON.parse(value);

        return (
          <Marker
            position={[coord["latitude"], coord["longitude"]]}
            icon={endIcon}
          />
        );
      })}
      {/* Route Lines */}
      {my_routes.map((route, index) => (
        <div key={index}>
          <Polyline positions={polyline.decode(route)} color="red" weight={5} />
        </div>
      ))}
      {osrm_routes.map((route, index) => (
        <div key={index}>
          <Polyline
            positions={polyline.decode(route)}
            color="#33C3F0"
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
    </MapContainer>
  ) : undefined;
};

export default TestingMap;
