"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L, { DivIcon } from "leaflet";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css"; // Leaflet styles
import { RouteQueryDTO } from "@/schemas/routeDTO";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { MapPin } from "lucide-react";
import ReactDOMServer from "react-dom/server";
import { useEffect, useState } from "react";

// import dynamic from 'next/dynamic';
// import 'leaflet/dist/leaflet.css'; // Ensure CSS is included

// Dynamically import MapContainer and TileLayer
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
  data?: RouteQueryDTO;
};

const RouteMap = (settings: DTO) => {
  const [isMounted, setIsMounted] = useState(false);

  const routes = settings.data?.accumulated_routes;
  const charging_stops = settings.data?.accumulated_charging_stops;

  const start = routes ? routes[0].start_coord : undefined;
  const end = routes ? routes[routes.length - 1].end_coord : undefined;

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
  const chargeStopIcon = createLucideIcon(MapPin, "oklch(62.3% 0.214 259.815)", 30); 

  return isMounted ? (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={[46.046, 14.496]}
        zoom={10}
        style={{ height: "500px", width: "100%" }}
        className="rounded-lg" // Apply rounding to map itself if CardContent p-0 is used
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Start Marker */}
        {start ? (
          <Marker position={[start[0], start[1]]} icon={startIcon} />
        ) : undefined}
        {/* End Marker */}
        {end ? (
          <Marker position={[end[0], end[1]]} icon={endIcon} />
        ) : undefined}
        {/* Route Lines */}
        {routes?.map((route, index) => (
          <div key={index}>
            <Polyline
              positions={polyline.decode(route.geometry)}
              color="#8B5CF6"
              weight={5}
            />
          </div>
        ))}
        {/* Charging stations Lines */}
        {charging_stops?.map((stop, index) => (
          <div key={index}>
            <Marker
              position={[stop.AddressInfo.Latitude, stop.AddressInfo.Longitude]}
              icon={chargeStopIcon}
            />
          </div>
        ))}
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
          <MapPin color="oklch(62.3% 0.214 259.815)" size={20} />
          <span style={{ marginLeft: "8px" }}>Charging Station</span>
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
          <span>Route</span>
        </div>
      </div>
    </div>
  ) : undefined;
};

export default RouteMap;
