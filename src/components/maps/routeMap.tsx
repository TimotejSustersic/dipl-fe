"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css"; // Leaflet styles
import { RouteDTO, RouteQueryDTO } from "@/schemas/routeDTO";

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
};

const RouteMap = (settings: DTO) => {

  const routes = settings.data.accumulated_routes;
  const charging_stops = settings.data.accumulated_charging_stops;

  const endCoordinates = routes[routes.length - 1].end_coord

  // Center map roughly between start and end
  const center: [number, number] = [
    (routes[0].start_coord[0] + endCoordinates[0]) / 2, // lat
    (routes[0].start_coord[1] + endCoordinates[1]) / 2, // lon
  ];

  // useEffect(() => {
  //   // Ensure map re-renders when route changes
  // }, [settings.data]);

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {/* Start Marker */}
      <Marker position={[routes[0].start_coord[0], routes[0].start_coord[1]]} />
      {/* End Marker */}
      <Marker position={[endCoordinates[0], endCoordinates[1]]} />
      {/* Route Lines */}
      {routes.map((route, index) => (
        <div key={index}>
          <Polyline positions={polyline.decode(route.geometry)} color="blue" weight={4} />
        </div>
      ))}      
      {/* Charging stations Lines */}
      {charging_stops.map((stop, index) => (
        <div key={index}>
          <Marker position={[stop.AddressInfo.Latitude, stop.AddressInfo.Longitude]} />
        </div>
      ))}
      
    </MapContainer>
  );
};

export default RouteMap;
