export type TestingRouteDTO = {
  id: number;
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
  my_accumulated_empty_battery: string[];
};

export type TestDTO = {
  name: string;
  cities: string[];
  id: number;
  my_accumulated_empty_battery?: string[];
};

export type TestInstanceDTO = {
  id: number;
  name: string;
  test: TestDTO;
  charging_stops: Array<string>;
};

export type TestInstanceRouteDTO = {
  id: number;
  test_route: TestingRouteDTO;
  new_accumulated_routes: string[];
  new_accumulated_charging_stops: string[];
  new_total_distance: number;
  new_total_time: number;
};
