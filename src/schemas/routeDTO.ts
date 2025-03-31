
export type RouteDTO =  {
  id: string,
  start: string,
  end: number,
  start_city: string,
  end_city: string,
  batery_capacity: number,
};

export const RouteDataFields =  {
  id: "routeId",
  start: "start",
  end: "end",
  start_city: "start_city",
  end_city: "end_city",
};
