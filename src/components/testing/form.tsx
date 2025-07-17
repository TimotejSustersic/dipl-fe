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
import { TestingDataFields, TestingSchema } from "@/components/testing/dto";
import { toast } from "sonner";

type DTO = {
  setRefresh: Dispatch<SetStateAction<boolean>>;
};

export const TestingForm = (settings: DTO) => {
  const onSubmit = (values: z.infer<typeof TestingSchema>) => {
    const params: any = new Object();
    params[UserDataFieldNames.user_name] = "";
    params[TestingDataFields.name] = values.name;
    params[TestingDataFields.cities] = values.cities;
    params[TestingDataFields.battery_capacity] = values.battery_capacity;

    toast.info("Test Started");
    API_POST("graphs/testing/new", params, (x: any) => {

      settings.setRefresh(true);
      toast.success("Testing Completed.");
    });
  };
  const form = useForm<z.infer<typeof TestingSchema>>({
    resolver: zodResolver(TestingSchema),
    defaultValues: {
      name: "undefined",
      cities: "",
      battery_capacity: "100",
    },
  });

  return (
    <div>
      {/* <h3>Create a new Vehicle</h3> */}
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <SimpleFormInput name="name" form={form} />
              <SimpleFormInput name="cities" form={form} />
              <SimpleFormInput name="battery_capacity" form={form} unit="%" />

              <Button
                type="submit"
                className=" border border-black hover:bg-white hover:text-black"
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
