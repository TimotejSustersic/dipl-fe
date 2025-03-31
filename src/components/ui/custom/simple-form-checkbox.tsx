"use client";

import {
  FormItem,
  FormControl,
  FormField,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

type DTO = {
  form: any;
  name: string;
};

export const SimpleFormCheckbox = (settings: DTO) => {
  return (
    <FormField
      control={settings.form.control}
      name={settings.name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox 
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{settings.name}</FormLabel>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
