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
import { RouteDataFields, RouteDTO, RouteHistoryDTO, RouteQueryDTO } from "@/schemas/routeDTO";
import { Card, CardContent } from "@/components/ui/card";
import RouteMap from "@/components/maps/routeMap";
import { Skeleton } from "@/components/ui/skeleton";

const Maps = () => {
  const [vehicles, setVehicles] = useState<Array<VehicleDTO>>([]);
  const [routesHistory, setRoutesHistory] = useState<Array<RouteHistoryDTO>>([]);
  const [selectedVehicle, selectVehicle] = useState<VehicleDTO | undefined>(
    undefined
  );
  const [selectedRoute, setSelectedRoute] = useState<RouteQueryDTO | undefined>(
    undefined
  );
  const [routesRefresh, setRoutesRefresh] = useState<boolean>(false);

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
    API_POST("graphs/routing/query", params, (result: Array<RouteHistoryDTO>) => {
      setRoutesHistory(result);
    });
  };
  const onSelectionChange = (name: string): void => {
    const selecton = vehicles.find((val: VehicleDTO) => val.name == name);
    selectVehicle(selecton);
  };

  return (
    <div className="h-full p-2">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25}>
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
                  {" "}
                  {key.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <RoutingForm
            selectedVehicle={selectedVehicle}
            setSelectedRoute={setSelectedRoute}
            setRefresh={setRoutesRefresh}
          />
          {routesHistory.map((route, index) => (
            <Card
              key={index}
              onClick={() => {
                if (selectedVehicle == undefined) return;

                setSelectedRoute(undefined);

                const params: any = new Object();
                params[UserDataFieldNames.user_name] = "";
                params[VehicleDataFields.vehicle_id] = selectedVehicle.id;
                // dont send so i know which one is different (i can get the data in backedn)
                // params[VehicleDataFields.battery_capacity] =
                //   selectedVehicle.battery_capacity;
                params[RouteDataFields.start_city] = route.start_city;
                params[RouteDataFields.end_city] = route.end_city;

                API_POST("graphs/routing/new", params, (result: RouteQueryDTO) => {
                  setSelectedRoute(result);
                });
              }}
            >
              <CardContent>
                <div>
                  {route.start_city} -{">"} {route.end_city}
                </div>
                <div>{route.total_consumption}</div>
                <div>{route.total_distance}</div>
                <div>{route.total_travel_time}</div>
              </CardContent>
            </Card>
          ))}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          {selectedRoute != undefined ? (
            <RouteMap data={selectedRoute} />
          ) : (
            <Skeleton className="h-[500px] w-full" />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Maps;
