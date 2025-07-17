"use client";

import { useEffect, useState } from "react";
import { API_POST } from "@/components/API/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Card } from "@/components/ui/card";
import {
  TestDTO,
  TestingRouteDTO,
  TestInstanceDTO,
  TestInstanceRouteDTO,
} from "@/schemas/testsDTO";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
// import Map from "@/components/infrastructure/map";
import { InfrastructureForm } from "@/components/infrastructure/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClockArrowDown,
  ClockArrowUp,
  MapPinMinus,
  MapPinPlus,
  MapPin,
  Clock,
} from "lucide-react";
import dynamic from 'next/dynamic';
const Map = dynamic(() => import("@/components/infrastructure/map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});


const InfrastructurePage = () => {
  const [testsBase, setTestsBase] = useState<TestDTO[]>([]);
  const [selectedTestBase, setSelectedTestBase] = useState<TestDTO | undefined>(
    undefined
  );
  const [testsInstance, setTestsInstance] = useState<
    TestInstanceDTO[] | undefined
  >(undefined);
  const [selectedTestInstance, setSelectedTestInstance] = useState<
    TestInstanceDTO | undefined
  >(undefined);

  // List of items on the left panel
  const [testingBaseItems, setTestingBaseItems] = useState<
    Array<TestingRouteDTO>
  >([]);
  const [testingInstanceItems, setTestingInstanceItems] = useState<
    Array<TestInstanceRouteDTO>
  >([]);
  // Selected checkboxes in the list
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<
    Set<TestInstanceRouteDTO | TestingRouteDTO>
  >(new Set());

  // Data fetched from backend for selected checkboxes, used as data source for map
  const [mapData, setMapData] = useState<
    Array<TestInstanceRouteDTO | TestingRouteDTO>
  >([]);
  const [emptyBatteryLocations, setEmptyBatteryLocations] = useState<
    Array<string>
  >([]);
  const [chargingStations, setChargingStations] = useState<Array<string>>([]);

  const [testingRefresh, setTestingRefresh] = useState(false);

  // Loading state for data fetching
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // New state for user added markers
  const [userMarkers, setUserMarkers] = useState<
    Array<{ latitude: number; longitude: number }>
  >([]);

  // Handler to add a new user marker
  const addUserMarker = (lat: number, lng: number) => {
    setUserMarkers((prev) => [...prev, { latitude: lat, longitude: lng }]);
  };

  // Handler to remove a user marker by index
  const removeUserMarker = (index: number) => {
    setUserMarkers((prev) => prev.filter((_, i) => i !== index));
  };

  // Fetch initial list of items on mount
  useEffect(() => {
    let params = new Object() as any;
    params["get_empty"] = true;

    API_POST("graphs/tests/query", params, (result: Array<TestDTO>) => {
      if (result?.length) setTestsBase(result);
      setTestingRefresh(false);
    });
  }, []);

  // on first drodown value changed
  useEffect(() => {
    if (selectedTestBase != null) {
      setEmptyBatteryLocations(
        selectedTestBase.my_accumulated_empty_battery ?? []
      );

      setMapData([]);

      let params = new Object() as any;
      params["test_id"] = selectedTestBase.id;

      API_POST(
        "graphs/infrastructure/query",
        params,
        (result: Array<TestInstanceDTO>) => {
          setTestsInstance(result);
        }
      );
      API_POST(
        "graphs/testing/items/query",
        params,
        (result: Array<TestingRouteDTO>) => {
          setTestingBaseItems(result);
        }
      );
    }
  }, [selectedTestBase, testingRefresh]);

  // on second drodown value changed
  useEffect(() => {
    if (selectedTestBase != null) {
      let params = new Object() as any;
      params["test_id"] = selectedTestBase.id;
      params["test_instance_id"] = selectedTestInstance?.id;

      setMapData([]);
      API_POST(
        "graphs/infrastructure/items/query",
        params,
        (result: Array<TestInstanceRouteDTO>) => {
          setTestingInstanceItems(result);
        }
      );
    }
  }, [selectedTestInstance]);

  const onCheckboxChange = (
    item: TestInstanceRouteDTO | TestingRouteDTO,
    checked: boolean
  ) => {
    setSelectedCheckboxes((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(item);
        setMapData((prevData) => {
          prevData.push(item as any);
          return prevData;
        });
      } else {
        newSet.delete(item);
        setMapData((prevData) => prevData.filter((d) => d.id !== item.id));
      }
      return newSet;
    });
  };

  const onAddNew = () => {
    setSelectedCheckboxes(new Set());
    setMapData([]);
  };

  const onSelectionChangeBase = (id: string): void => {
    const selecton = testsBase.find((val: TestDTO) => val.id == id);
    setSelectedTestBase(selecton);
  };
  const onSelectionChangeInstance = (name: string): void => {
    const selecton = testsInstance?.find(
      (val: TestInstanceDTO) => val.name == name
    );
    setSelectedTestInstance(selecton);
    if (selecton != null)
      setUserMarkers(
        selecton.charging_stops.map((val) => JSON.parse(val))
      );
  };
  return (
    <div className="h-full p-4">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={30}
          className="space-y-4 pr-4 border-r border-gray-200 flex flex-col"
        >
          <Select
            onValueChange={onSelectionChangeBase}
            value={selectedTestBase?.id}
          >
            <SelectTrigger className="m-[5px] w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {testsBase.map((test, index) => (
                <SelectItem key={test.id} value={test.id}>
                  {" "}
                  {test.name} - {test.battery_capacity}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {testsInstance ? (
            <Select
              onValueChange={onSelectionChangeInstance}
              value={selectedTestInstance?.name}
            >
              <SelectTrigger className="m-[5px] w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {testsInstance.map((test, index) => (
                  <SelectItem key={index} value={test.name}>
                    {" "}
                    {test.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : undefined}
          <div className="flex-1 overflow-y-auto space-y-2">
            <ScrollArea className="h-[700px]">
              {selectedTestInstance == null
                ? testingBaseItems.map((item: TestingRouteDTO, index) => (
                    <Card
                      key={index}
                      className={`flex items-center justify-between p-3 mt-1 ${
                        Math.abs(
                          item.my_total_distance - item.osrm_total_distance
                        ) /
                          1000 >
                        4 // more than 2km
                          ? "bg-red-200"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col">
                        <div>
                          {item.start_city} -{">"} {item.end_city}
                        </div>
                        <div className="flex gap-2">
                          <div className="flex items-center space-x-2">
                            <MapPinPlus size={16} />
                            <span>
                              {(
                                (item.my_total_distance -
                                  item.osrm_total_distance) /
                                1000
                              ).toFixed(2)}
                              km
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <ClockArrowUp size={16} />
                            <span>
                              {(
                                (item.my_total_time - item.osrm_total_time) /
                                60
                              ).toFixed(1)}{" "}
                              min
                            </span>
                          </div>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedCheckboxes.has(item)}
                        onCheckedChange={(checked) =>
                          onCheckboxChange(item, checked === true)
                        }
                      />
                    </Card>
                  ))
                : testingInstanceItems.map(
                    (item: TestInstanceRouteDTO, index) => (
                      <Card
                        key={index}
                        className={`p-3 mt-1 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-center ${
                          (item.test_route.my_total_distance -
                            item.test_route.osrm_total_distance +
                            item.new_total_distance) /
                            1000 >
                          4 // more than 4km
                            ? "bg-red-200"
                            : "bg-green-200"
                        }`}
                      >
                        <div className="flex flex-col flex-grow">
                          <div className="font-semibold mb-2">
                            {item.test_route.start_city} - {">"}{" "}
                            {item.test_route.end_city}
                          </div>
                          <div className="text-gray-700 flex flex-col gap-1">
                            <div className="border-l-4 pl-2 border-blue-600">
                              <div className="font-medium mb-1">Original</div>
                              <div className="flex gap-2">
                                <div className="flex items-center space-x-2">
                                  <MapPin size={16} />
                                  <span>
                                    {(
                                      (item.test_route.my_total_distance -
                                        item.test_route.osrm_total_distance) /
                                      1000
                                    ).toFixed(2)}{" "}
                                    km
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock size={16} />
                                  <span>
                                    {(
                                      (item.test_route.my_total_time -
                                        item.test_route.osrm_total_time) /
                                      60
                                    ).toFixed(1)}{" "}
                                    min
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="border-l-4 pl-2 border-red-500 ">
                              <div className="font-medium mb-1">Saved</div>
                              <div className="flex gap-2">
                                <div className="flex items-center space-x-2">
                                  <MapPinMinus size={16} />
                                  <span>
                                    {
                                      -(item.new_total_distance / 1000).toFixed(
                                        2
                                      )
                                    }{" "}
                                    km
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <ClockArrowDown size={16} />
                                  <span>
                                    {-(item.new_total_time / 60).toFixed(1)} min
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Checkbox
                          checked={selectedCheckboxes.has(item)}
                          onCheckedChange={(checked) =>
                            onCheckboxChange(item, checked === true)
                          }
                        />
                      </Card>
                    )
                  )}
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70} className="pl-4 overflow-y-auto">
          <Card className="p-4 flex space-x-4">
            <ScrollArea className="h-60 w-1/2 rounded-md border">
              <Table className="flex-grow">
                <TableCaption>A list of points.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>latitude</TableHead>
                    <TableHead>longitude</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userMarkers.map((point, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {Math.floor(point.latitude * 1000) / 1000}
                      </TableCell>
                      <TableCell>
                        {Math.floor(point.longitude * 1000) / 1000}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            <InfrastructureForm
              setRefresh={setTestingRefresh}
              userMarkers={userMarkers}
              test_id={selectedTestBase?.id}
            />
          </Card>

          {testsBase != null ? (
            <div>
              <div className="mt-6 border rounded-lg shadow-md overflow-hidden">
                <Map
                  routes={mapData}
                  charging_stations={chargingStations}
                  empty_battery_locations={emptyBatteryLocations}
                  isLoading={isLoading}
                  userMarkers={userMarkers}
                  addUserMarker={addUserMarker}
                  removeUserMarker={removeUserMarker}
                />
              </div>
            </div>
          ) : undefined}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default InfrastructurePage;
