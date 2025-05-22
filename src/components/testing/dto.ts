import * as z from "zod";

export const TestingSchema = z.object({
  cities: z.string(),
  battery_capacity: z.string(),
});

export const TestingDataFields =  {
  cities: "cities",
  battery_capacity: "battery_capacity",
};