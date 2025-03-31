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
import { VehicleDTO } from "@/schemas/vehicleDTO";
import { RoutingForm } from "@/components/maps/form";
import { RouteDTO } from "@/schemas/routeDTO";
import { Card, CardContent } from "@/components/ui/card";

const Maps = () => {
  const [vehicles, setVehicles] = useState<Array<VehicleDTO>>([]);
  const [routesHistory, setRoutesHistory] = useState<Array<RouteDTO>>([]);
  const [selectedVehicle, selectVehicle] = useState<VehicleDTO | undefined>(
    undefined
  );
  const [graphData, setGraphData] = useState<unknown | undefined>(undefined);
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
    API_POST("graphs/routing/query", params, (result: Array<RouteDTO>) => {
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
            setGraphData={setGraphData}
            setRefresh={setRoutesRefresh}
          />
          {routesHistory.map((route, index) => (
            <Card key={index}>
              <CardContent>
                <div
                  onClick={() => {
                    setGraphData(route);
                  }}
                >
                  {route.start_city} -{">"} {route.end_city}
                </div>
              </CardContent>
            </Card>
          ))}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <div>{String(graphData)}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Maps;
