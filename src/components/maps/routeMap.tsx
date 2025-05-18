"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L, { DivIcon } from "leaflet";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css"; // Leaflet styles
import { RouteDTO, RouteQueryDTO } from "@/schemas/routeDTO";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { MapPin, CircleDot } from "lucide-react";
import ReactDOMServer from "react-dom/server";

// Fix default marker icons (Next.js issue)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

type DTO = {
  data: RouteQueryDTO;
  isLoading: boolean;
};

const RouteMap = (settings: DTO) => {
  const routes = settings.data.accumulated_routes;
  const charging_stops = settings.data.accumulated_charging_stops;

  const endCoordinates = routes[routes.length - 1].end_coord;

  // Center map roughly between start and end
  const center: [number, number] = [
    (routes[0].start_coord[0] + endCoordinates[0]) / 2, // lat
    (routes[0].start_coord[1] + endCoordinates[1]) / 2, // lon
  ];

  // useEffect(() => {
  //   // Ensure map re-renders when route changes
  // }, [settings.data]);

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

  return (
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
      <Marker
        position={[routes[0].start_coord[0], routes[0].start_coord[1]]}
        icon={startIcon}
      />
      {/* End Marker */}
      <Marker
        position={[endCoordinates[0], endCoordinates[1]]}
        icon={endIcon}
      />
      {/* Route Lines */}
      {routes.map((route, index) => (
        <div key={index}>
          <Polyline
            positions={polyline.decode(route.geometry)}
            color="#33C3F0"
            weight={5}
          />
        </div>
      ))}
      {/* Charging stations Lines */}
      {charging_stops.map((stop, index) => (
        <div key={index}>
          <Marker
            position={[stop.AddressInfo.Latitude, stop.AddressInfo.Longitude]}
            icon={chargeStopIcon}
          />
        </div>
      ))}
    </MapContainer>
  );
};

export default RouteMap;
