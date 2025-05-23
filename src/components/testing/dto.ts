import * as z from "zod";

export const TestingSchema = z.object({
  name: z.string(),
  cities: z.string(),
  battery_capacity: z.string(),
});

export const TestingDataFields =  {
  name: "name",
  cities: "cities",
  battery_capacity: "battery_capacity",
};