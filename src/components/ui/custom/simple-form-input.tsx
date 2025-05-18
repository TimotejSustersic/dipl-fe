"use client";

import {
  FormItem,
  FormControl,
  FormField,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type DTO = {
  form: any;
  name: string;
};

export const SimpleFormInput = (settings: DTO) => {
  return (
    <FormField
      control={settings.form.control}
      name={settings.name}
      render={({ field }) => (
        <FormItem className="mb-4">
          <FormLabel className="font-semibold text-gray-800">
            {settings.name}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </FormControl>
          <FormMessage className="text-red-600" />
        </FormItem>
      )}
    />
  );
};
