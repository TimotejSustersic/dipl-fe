"use client";

import { API_POST } from "@/components/API/utils";
import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserDataFieldNames } from "@/schemas/userDTO";
import { VehicleDataFields, VehicleDTO } from "@/schemas/vehicleDTO";
import { RoutingForm } from "@/components/maps/form";
import {
  RouteDataFields,
  RouteDTO,
  RouteHistoryDTO,
  RouteQueryDTO,
} from "@/schemas/routeDTO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RouteMap from "@/components/maps/routeMap";
import { Skeleton } from "@/components/ui/skeleton";

const Maps = () => {
  const [vehicles, setVehicles] = useState<Array<VehicleDTO>>([]);
  const [routesHistory, setRoutesHistory] = useState<Array<RouteHistoryDTO>>(
    []
  );
  const [selectedVehicle, selectVehicle] = useState<VehicleDTO | undefined>(
    undefined
  );
  const [selectedRoute, setSelectedRoute] = useState<RouteQueryDTO | undefined>(
    undefined
  );
  const [routesRefresh, setRoutesRefresh] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getCars();
    getRoutes();
  }, [routesRefresh]);

  const getCars = () => {
    const params = {
      [UserDataFieldNames.user_name]: "",
    };
    API_POST("graphs/vehicles/query", params, (result: Array<VehicleDTO>) => {
      setVehicles(result);
      if (result.length) selectVehicle(result[0]);
      setRoutesRefresh(false);
    });
  };
  const getRoutes = () => {
    const params = {
      [UserDataFieldNames.user_name]: "",
    };
    API_POST(
      "graphs/routing/query",
      params,
      (result: Array<RouteHistoryDTO>) => {
        setRoutesHistory(result);
      }
    );
  };
  const onSelectionChange = (name: string): void => {
    const selecton = vehicles.find((val: VehicleDTO) => val.name == name);
    selectVehicle(selecton);
  };

  return (
    <div className="h-full p-4">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={30}
          className="space-y-6 pr-4 border-r border-gray-200"
        >
          <h2 className="text-2xl font-semibold mb-4">
            Select Vehicle & Routes
          </h2>
          <div>
            <label
              htmlFor="vehicle-select"
              className="block mb-2 font-medium text-sm text-gray-700"
            >
              Vehicle
            </label>
            <Select
              onValueChange={onSelectionChange}
              value={selectedVehicle?.name}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((key, index) => (
                  <SelectItem key={index} value={key.name}>
                    {key.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <RoutingForm
            selectedVehicle={selectedVehicle}
            setSelectedRoute={setSelectedRoute}
            setRefresh={setRoutesRefresh}
            setIsLoading={setIsLoading}
          />

          <div className="space-y-3 mt-6">
            {routesHistory.map((route, index) => (
              <Card
                key={index}
                onClick={() => {
                  if (selectedVehicle == undefined) return;

                  setSelectedRoute(undefined);

                  const params: any = new Object();
                  params[UserDataFieldNames.user_name] = "";
                  params[VehicleDataFields.vehicle_id] = selectedVehicle.id;
                  params[RouteDataFields.start_city] = route.start_city;
                  params[RouteDataFields.end_city] = route.end_city;

                  API_POST(
                    "graphs/routing/new",
                    params,
                    (result: RouteQueryDTO) => {
                      setSelectedRoute(result);
                    }
                  );
                }}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle>
                    {route.start_city} -{">"} {route.end_city}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Consumption: {Math.round(route.total_consumption * 100)/100} K/Wh</span>
                    <span>Distance: {Math.round((route.total_distance / 1000) * 100)/100} km</span>
                    <span>Travel Time: {Math.round((route.total_travel_time / 3600) * 100)/100} h</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70} className="pl-4">
          {selectedRoute != undefined ? (
            <div className="border rounded-lg shadow-md overflow-hidden">
              <RouteMap data={selectedRoute} isLoading={isLoading} />
            </div>
          ) : (
            <Skeleton className="h-[500px] w-full rounded-lg" />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Maps;
