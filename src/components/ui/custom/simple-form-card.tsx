"use client";

import * as z from "zod";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { SimpleFormInput } from "./simple-form-input";
import { FormControl } from "@/components/ui/form";
import { Dispatch, SetStateAction } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";

type DTO = {
  form: any;
  schema: z.ZodObject<any>;
  title: string;
  used: boolean;
  setUsed: Dispatch<SetStateAction<boolean>>;
};

export const SimpleFormCard = (settings: DTO) => {

  const fields = Object.entries(settings.schema.shape);

  const handleCheckboxChange = (check: boolean) => {
    settings.setUsed(check);
  };

  return (
    <div>
      <div className="flex">
      {/* <FormControl> */}
        <Checkbox
          checked={settings.used}
          onCheckedChange={handleCheckboxChange}
        />
      {/* </FormControl> */}
      <h3>{settings.title}</h3>
      </div>
      <Card className={settings.used ? "border-black" : "hidden"}>
        <CardContent>
            {fields.map(([fieldName, fieldSchema], index: number) => (              
              // const fieldType = fieldSchema._def.typeName;
              <SimpleFormInput key={index} name={fieldName} form={settings.form} />
            ))}
        </CardContent>
      </Card>
    </div>
  );
};
