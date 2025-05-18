export type RouteDTO = {
  geometry: string; // OSRM polyline

  start_coord: [number, number]; // [lon, lat]
  end_coord: [number, number]; // [lon, lat]

  //
  start_city: string;
  end_city: string;
  //

  estimated_distance: number;
  estimated_time: number;
  estimated_consumption: number;
};

export type RouteQueryDTO = {
  accumulated_routes: Array<RouteDTO>;
  accumulated_charging_stops: Array<any>;

  total_distance: number;
  total_travel_time: number;
  total_consumption: number;
};

export type RouteHistoryDTO = {
  vehicle_name: string;
  start_city: string;
  end_city: string;
  total_distance: number;
  total_travel_time: number;
  total_consumption: number;
};

export const RouteDataFields = {
  id: "routeId",
  start: "start",
  end: "end",
  start_city: "start_city",
  end_city: "end_city",
  route: "route",
};
