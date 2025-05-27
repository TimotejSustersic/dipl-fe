"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { API_POST } from "@/components/API/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SimpleFormInput } from "@/components/ui/custom/simple-form-input";
import { Dispatch, SetStateAction, useEffect } from "react";

import { UserDataFieldNames } from "@/schemas/userDTO";
import { VehicleDataFields, VehicleDTO } from "@/schemas/vehicleDTO";
import { RouteDataFields, RouteDTO, RouteQueryDTO } from "@/schemas/routeDTO";
import { RouteSchema } from "@/components/maps/route";

type DTO = {
  selectedVehicle?: VehicleDTO;
  setSelectedRoute: Dispatch<SetStateAction<RouteQueryDTO | undefined>>;
  setRefresh: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const RoutingForm = (settings: DTO) => {
  // const { data: session } = useSession();

  // useEffect(() => {
  //   const params = {
  //     [UserDataFieldNames.user_name]: "",
  //     [GeneralDTO.id]: settings.selectedVehicle?.id,
  //   };
  //   API_POST("graphs/vehicle/query/", params, (result: Array<VehicleDTO>) => {
  //     setVehicles(result);
  //   });
  // }, []);

  const form = useForm<z.infer<typeof RouteSchema>>({
    resolver: zodResolver(RouteSchema),
    defaultValues: {
      vehicle_id: String(
        settings.selectedVehicle?.id ?? undefined
      ),      
      battery_capacity: "100",
      start_city: "",
      end_city: "",
    },
  });

  useEffect(() => {
    
    form.setValue(
      "vehicle_id",
      String(settings.selectedVehicle?.id) ?? undefined
    );
  }, [settings.selectedVehicle, form]);

  const onSubmit = (values: z.infer<typeof RouteSchema>) => {
    
    settings.setSelectedRoute(undefined);

    const params: any = new Object();
    params[UserDataFieldNames.user_name] = "";
    params[VehicleDataFields.vehicle_id] = values.vehicle_id;
    params[VehicleDataFields.battery_capacity] = values.battery_capacity;
    params[RouteDataFields.start_city] = values.start_city;
    params[RouteDataFields.end_city] = values.end_city;

    settings.setIsLoading(true);
    API_POST("graphs/routing/new", params, (result: RouteQueryDTO) => {
      settings.setSelectedRoute(result);
      settings.setRefresh(true);
      settings.setIsLoading(false);
    });
  };

  return (
    <div>
      <h3>Create a new Route</h3>
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <SimpleFormInput name="battery_capacity" form={form} />
              <SimpleFormInput name="start_city" form={form} />
              <SimpleFormInput name="end_city" form={form} />

              <Button 
              type="submit"
              className=" border border-black hover:bg-white hover:text-black"
              >Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
