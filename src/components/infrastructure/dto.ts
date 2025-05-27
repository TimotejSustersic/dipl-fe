import * as z from "zod";

export const InfrastructureTestingSchema = z.object({
  name: z.string(),
});

export const InfrastructureTestingDataFields =  {
  test_id: "test_id",
  name: "name",
  additional_charging_stations: "additional_charging_stations",
};