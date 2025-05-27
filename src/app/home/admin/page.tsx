"use client";

import { API_POST } from "@/components/API/utils";
import { Button } from "@/components/ui/button";

const Cars = () => {
  const clear_data = (endpoint: string) => {
    API_POST("graphs/admin/clear/" + endpoint);
  };

  const getDom = (name: string) => {
    return (
      <div className="h-full p-4">
        <h2 className="font-extrabold text-2xl p-4 bg-stone-300 text-stone-800 border-b border-stone-500">
          {name}
        </h2>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => clear_data(name)}
        >
          X
        </Button>
      </div>
    );
  };

  return (
    <div>
      {getDom("TestInstance")}
      {getDom("TestInstanceRoute")}
      {getDom("Test")}
      {getDom("TestRoute")}
      {getDom("Route")}
      {getDom("Vehicle")}
    </div>
  );
};

export default Cars;
