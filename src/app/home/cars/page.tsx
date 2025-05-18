"use client";

import { API_POST } from "@/components/API/utils";
import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { VehicleDataFields, VehicleDTO } from "@/schemas/vehicleDTO";
import { RouteDataFields } from "@/schemas/routeDTO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { VehicleForm } from "@/components/cars/form";

const Cars = () => {
  const [selectedVehicle, selectVehicle] = useState<VehicleDTO | undefined>();
  const [vehicles, setVehicles] = useState<Array<VehicleDTO>>([]);
  const [vehiclesRefresh, setVehiclesRefresh] = useState<boolean>(false);

  useEffect(() => {
    API_POST(
      "graphs/vehicles/query",
      undefined,
      (result: Array<VehicleDTO>) => {

        setVehicles(result);
        setVehiclesRefresh(false);
      }
    );
  }, [vehiclesRefresh]);

  const discardTest = (id: number) => {
    const selectEmpty = selectedVehicle?.id == id;

    const params: any = new Object();
    params[VehicleDataFields.vehicle_id] = id;

    API_POST("graphs/vehicles/discard", params, () => {
      setVehiclesRefresh(true);
      if (selectEmpty) selectVehicle(undefined);
    });
  };

  return (
    <div className="h-full p-2">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25}>
          <div id="evaluation-sidebar">
            <h2 className="font-bold text-lg p-4 bg-gray-200">Vehicles</h2>
            <div>
              <Card
                className="bg-green-100 hover:bg-green-200"
                onClick={() => {
                  selectVehicle(undefined);
                }}
              >
                <CardContent>
                  <PlusIcon></PlusIcon>
                </CardContent>
              </Card>
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="bg-green-200">
                  <CardContent>
                    <div className="flex">
                      <div
                        className="w-full"
                        onClick={() => {
                          selectVehicle(vehicle);
                        }}
                      >
                        {vehicle.name}: {vehicle.battery_capacity}
                      </div>
                      <Button onClick={() => discardTest(vehicle.id)}>X</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          {selectedVehicle != undefined ? (
            <div>
              <div>name: {selectedVehicle.name}</div>
              <div>battery_capacity: {selectedVehicle.battery_capacity}</div>
              <div>year_of_manufacture: {selectedVehicle.year_of_manufacture}</div>
              <div>consumption_rate: {selectedVehicle.consumption_rate}</div>
            </div>
          ) : (
            <VehicleForm setRefresh={setVehiclesRefresh} />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Cars;
