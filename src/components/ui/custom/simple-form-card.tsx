"use client";

import * as z from "zod";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { SimpleFormInput } from "./simple-form-input";
import { Dispatch, SetStateAction } from "react";

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
      <div className="flex items-center space-x-2 mb-2">
        <Checkbox
          checked={settings.used}
          onCheckedChange={handleCheckboxChange}
          className="focus:ring-2 focus:ring-green-500 rounded"
        />
        <h3 className="text-lg font-semibold text-gray-900">{settings.title}</h3>
      </div>
      <Card
        className={`transition-all duration-300 ease-in-out ${
          settings.used ? "border border-green-500 shadow-lg" : "hidden"
        }`}
      >
        <CardContent className="space-y-4 p-4">
          {fields.map(([fieldName, fieldSchema], index: number) => (
            <SimpleFormInput key={index} name={fieldName} form={settings.form} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
