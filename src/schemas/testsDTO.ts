export type TestingRouteDTO = {
  start_city: string;
  end_city: string;
  start_coord: string;
  end_coord: string;
  osrm_accumulated_routes: string;
  osrm_total_time: number;
  osrm_total_distance: number;
  my_accumulated_routes: string[];
  my_accumulated_charging_stops: string[];
  my_total_distance: number;
  my_total_time: number;
};
export type TestDTO = {
  name: string;
  cities: string[];
  id: number;
};