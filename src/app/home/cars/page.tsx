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
import { PlusIcon, BatteryCharging, Calendar, Zap } from "lucide-react";
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
    <div className="h-full p-4">
      <ResizablePanelGroup direction="horizontal" className="gap-4">
        <ResizablePanel defaultSize={30}>
          <div id="evaluation-sidebar" className="h-full flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 px-6 py-5 border-b-4 border-lime-600 rounded-t-lg shadow-md">
              Vehicles
            </h2>
            <div className="flex flex-col gap-3 p-4 overflow-y-auto">
              <Card
                className="bg-lime-200 hover:bg-lime-300 cursor-pointer flex items-center justify-center space-x-2 transition-shadow shadow-sm hover:shadow-lg"
                onClick={() => {
                  selectVehicle(undefined);
                }}
              >
                <CardContent className="flex gap-2 p-3">
                  <PlusIcon className="text-black" size={24} />
                  <span className="font-semibold text-black">
                    Add Vehicle
                  </span>
                </CardContent>
              </Card>
              {vehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className={`bg-lime-100 hover:bg-lime-200 cursor-pointer transition-shadow shadow-sm hover:shadow-lg ${
                    selectedVehicle?.id === vehicle.id
                      ? "ring-2 ring-lime-500"
                      : ""
                  }`}
                >
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div
                        className="w-full"
                        onClick={() => {
                          selectVehicle(vehicle);
                        }}
                      >
                        <div className="font-semibold">
                          {vehicle.name}
                        </div>
                        <div className="flex space-x-3 mt-1 text-green-700 text-sm">
                          <div className="flex items-center space-x-1">
                            <BatteryCharging size={14} />
                            <span>{vehicle.battery_capacity} kWh</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>{vehicle.year_of_manufacture}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap size={14} />
                            <span>{vehicle.consumption_rate} kWh/km</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => discardTest(vehicle.id)}
                      >
                        X
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>
              {selectedVehicle != undefined ? (
                <Card className="p-6 m-4 bg-lime-50 shadow-lg rounded-lg transition-all duration-300 ease-in-out">
                  <h3 className="text-2xl font-extrabold mb-4 ">
                    {selectedVehicle.name}
                  </h3>
                  <div className="space-y-2 text-lime-800">
                    <div className="flex items-center space-x-2">
                      <BatteryCharging />
                      <span>Battery Capacity:</span>
                      <span className="font-semibold">
                        {selectedVehicle.battery_capacity} kWh
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar />
                      <span>Year of Manufacture:</span>
                      <span className="font-semibold">
                        {selectedVehicle.year_of_manufacture}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap />
                      <span>Consumption Rate:</span>
                      <span className="font-semibold">
                        {selectedVehicle.consumption_rate} kWh/km
                      </span>
                    </div>
                  </div>
                </Card>
              ) : (
                <VehicleForm setRefresh={setVehiclesRefresh} />
              )}
            </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Cars;
