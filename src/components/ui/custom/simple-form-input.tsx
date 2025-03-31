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
  form: any,
  name: string,
};

export const SimpleFormInput = (settings: DTO) => {
  
  return (
    <FormField
      control={settings.form.control}
      name={settings.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{settings.name}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
