
export type RouteDTO =  {
  start_city: string,
  end_city: string,

  distance: number;
  start: [number, number]; // [lon, lat]
  end: [number, number];   // [lon, lat]
  geometry: string;        // OSRM polyline
  waypoints: { name: string; lon: number; lat: number }[];
};

export const RouteDataFields =  {
  id: "routeId",
  start: "start",
  end: "end",
  start_city: "start_city",
  end_city: "end_city",
  route: "route",
};