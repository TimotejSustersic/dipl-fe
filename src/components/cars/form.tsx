"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { API_POST } from "@/components/API/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SimpleFormInput } from "@/components/ui/custom/simple-form-input";
import { Dispatch, SetStateAction } from "react";

import { UserDataFieldNames } from "@/schemas/userDTO";
import { VehicleDataFields } from "@/schemas/vehicleDTO";
import { VehicleSchema } from "@/components/cars/vehicle";

type DTO = {
  setRefresh: Dispatch<SetStateAction<boolean>>;
};

export const VehicleForm = (settings: DTO) => {
  const onSubmit = (values: z.infer<typeof VehicleSchema>) => {
    const params: any = new Object();
    params[UserDataFieldNames.user_name] = "";
    params[VehicleDataFields.name] = values.name;
    params[VehicleDataFields.battery_capacity] = values.battery_capacity;
    params[VehicleDataFields.consumption_rate] = values.consumption_rate;
    params[VehicleDataFields.year_of_manufacture] = values.year_of_manufacture;

    API_POST("graphs/vehicles/new", params, () => {
      settings.setRefresh(true);
    });
  };
  const form = useForm<z.infer<typeof VehicleSchema>>({
    resolver: zodResolver(VehicleSchema),
    defaultValues: {
      name: "",
      battery_capacity: "300",
      consumption_rate: "6",
      year_of_manufacture: "2000",
    },
  });

  return (
    <div>
      <h3>Create a new Vehicle</h3>
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <SimpleFormInput name="name" form={form} />
              <SimpleFormInput name="year_of_manufacture" form={form} />
              <SimpleFormInput name="battery_capacity" form={form} />
              <SimpleFormInput name="consumption_rate" form={form} />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
