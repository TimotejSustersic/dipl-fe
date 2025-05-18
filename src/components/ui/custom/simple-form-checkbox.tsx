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
        <FormItem className="flex flex-row items-center space-x-3 rounded-md border border-gray-300 p-3 shadow-sm hover:shadow-md transition-shadow">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="focus:ring-2 focus:ring-green-500 rounded"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="font-semibold text-gray-800">{settings.name}</FormLabel>
          </div>
          <FormMessage className="text-red-600" />
        </FormItem>
      )}
    />
  );
};
