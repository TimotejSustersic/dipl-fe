import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import polyline from '@mapbox/polyline';
import 'leaflet/dist/leaflet.css'; // Leaflet styles
import { RouteDTO } from '@/schemas/routeDTO';

// Fix default marker icons (Next.js issue)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

type DTO = {
  data: RouteDTO;
};

const RouteMap = (settings: DTO) => {
  console.log(settings)
  // Decode polyline to [lat, lon] array
  const routeCoords = polyline.decode(settings.data.geometry);
  // Center map roughly between start and end
  const center: [number, number] = [
    (settings.data.start[1] + settings.data.end[1]) / 2, // lat
    (settings.data.start[0] + settings.data.end[0]) / 2, // lon
  ];

  useEffect(() => {
    // Ensure map re-renders when route changes
  }, [settings.data]);

  return (
    <MapContainer center={center} zoom={10} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {/* Start Marker */}
      <Marker position={[settings.data.start[1], settings.data.start[0]]} />
      {/* End Marker */}
      <Marker position={[settings.data.end[1], settings.data.end[0]]} />
      {/* Route Line */}
      <Polyline positions={routeCoords} color="blue" weight={4} />
    </MapContainer>
  );
};

export default RouteMap;