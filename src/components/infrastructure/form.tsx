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
import { InfrastructureTestingDataFields, InfrastructureTestingSchema } from "@/components/infrastructure/dto";

type DTO = {
  setRefresh: Dispatch<SetStateAction<boolean>>;
  userMarkers?: Array<{ latitude: number; longitude: number }>;
  test_id?: number;
};

export const InfrastructureForm = (settings: DTO) => {
  const onSubmit = (values: z.infer<typeof InfrastructureTestingSchema>) => {
    const params: any = new Object();
    params[UserDataFieldNames.user_name] = "";
    params[InfrastructureTestingDataFields.name] = values.name;
    params["test_id"] = settings.test_id;
    params["additional_charging_stations"] = settings.userMarkers;

    API_POST("graphs/infrastructure/new", params, () => {
      settings.setRefresh(true);
    });
  };
  const form = useForm<z.infer<typeof InfrastructureTestingSchema>>({
    resolver: zodResolver(InfrastructureTestingSchema),
    defaultValues: {
      name: "undefined",
    },
  });

  return (
    <div className="flex-grow" >
      {/* <h3>Create a new Vehicle</h3> */}
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <SimpleFormInput name="name" form={form} />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
