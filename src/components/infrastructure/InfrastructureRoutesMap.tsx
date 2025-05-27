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
import { TestingRouteDTO, TestInstanceRouteDTO } from "@/schemas/testsDTO";

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
  routes: Array<TestInstanceRouteDTO | TestingRouteDTO>;
  isLoading: boolean;
  empty_battery_locations: string[];
  charging_stations: string[];
};

const InfrastructureRoutesMap = (settings: DTO) => {
  const [isMounted, setIsMounted] = useState(false);

  const my_routes = settings.routes.flatMap((dto: any) =>
    dto.test_route
      ? dto.test_route.my_accumulated_routes
      : dto.my_accumulated_routes
  );
  const my_charging_stops = settings.routes.flatMap(
    (dto: any) => dto.test_route ? dto.test_route.my_accumulated_charging_stops : dto.my_accumulated_charging_stops
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
          <Polyline positions={polyline.decode(route)} 
          color="red" weight={5} />
        </div>
      ))}
      {/* Route Lines */}
      {new_routes.map((geometry, index) => (
        <div key={index}>
          <Polyline
            positions={polyline.decode(geometry)}
            color="#33C3F0"
            weight={5}
          />
        </div>
      ))}
      {/* Route Lines */}
      {osrm_routes.map((geometry, index) => (
        <div key={index}>
          <Polyline
            positions={polyline.decode(geometry)}
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
      {/* Charging stations Lines */}
      {new_charging_stops.map((stop, index) => {
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
      {/* Charging stations */}
      {settings.charging_stations.length ? settings.charging_stations.map((stop, index) => {
        const coord = JSON.parse(stop);


        return (
          <div key={index}>
            <Marker
              position={[coord.latitude, coord.longitude]}
              icon={chargeStopIcon}
            />
          </div>
        );
      }) : undefined} 
      {/* empty points*/}
      {settings.empty_battery_locations.map((stop, index) => {
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

export default InfrastructureRoutesMap;
