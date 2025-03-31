import * as z from "zod";

export const RouteSchema = z.object({
  vehicle_id: z.string(),
  battery_capacity: z.string(),
  start_city: z.string(),
  end_city: z.string(),
});
