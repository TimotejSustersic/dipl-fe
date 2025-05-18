import * as z from "zod";

export const VehicleSchema = z.object({
  name: z.string(),
  battery_capacity: z.string(),
  consumption_rate: z.string(),
  year_of_manufacture: z.string(),
});
