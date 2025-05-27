"use client";

import { useEffect, useState } from "react";
import { API_POST } from "@/components/API/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Card, CardContent } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TestingForm } from "@/components/testing/form";
import TestingMap from "@/components/testing/map";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TestDTO, TestingRouteDTO } from "@/schemas/testsDTO";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const TestingPage = () => {
  const [testsDropdown, setTestsDropdown] = useState<TestDTO[]>([]);
  const [selectedTest, setSelectetTest] = useState<TestDTO | undefined>(
    undefined
  );

  // List of items on the left panel
  const [testingItems, setTestingItems] = useState<Array<TestingRouteDTO>>([]);
  // Search filter text
  const [searchText, setSearchText] = useState<string>("");
  // Selected checkboxes in the list
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<
    Set<TestingRouteDTO>
  >(new Set());

  // Data fetched from backend for selected checkboxes, used as data source for map
  const [mapData, setMapData] = useState<Array<TestingRouteDTO>>([]);

  const [testingRefresh, setTestingRefresh] = useState(false);
  // Loading state for data fetching
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch initial list of items on mount
  useEffect(() => {
    API_POST("graphs/tests/query", undefined, (result: Array<TestDTO>) => {
      if (result?.length) setTestsDropdown(result);
      setTestingRefresh(false);
    });
  }, [testingRefresh]);

  // on drodown value changed
  useEffect(() => {
    if (selectedTest != null) {
      let params = new Object() as any;
      params["search"] = searchText;
      params["test_id"] = selectedTest.id;

      API_POST(
        "graphs/testing/items/query",
        params,
        (result: Array<TestingRouteDTO>) => {
          setTestingItems(result);
        }
      );
    }
  }, [selectedTest, searchText]);

  const onCheckboxChange = (item: TestingRouteDTO, checked: boolean) => {
    setSelectedCheckboxes((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(item);
        setMapData((prevData) => {
          prevData.push(item);
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

  const onSelectionChange = (name: string): void => {
    const selecton = testsDropdown.find((val: TestDTO) => val.name == name);
    setSelectetTest(selecton);
  };

  return (
    <div className="h-full p-4">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={30}
          className="space-y-4 pr-4 border-r border-gray-200 flex flex-col"
        >
          <div className="flex items-center space-x-2">
            <Select
              onValueChange={onSelectionChange}
              value={selectedTest?.name}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {testsDropdown.map((test, index) => (
                  <SelectItem key={index} value={test.name}>
                    {" "}
                    {test.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="cursor-pointer flex items-center justify-center space-x-2 transition-shadow shadow-sm hover:shadow-lg flex-shrink-0"
              onClick={onAddNew}
            >
              <PlusIcon size={40} />
            </Button>
          </div>
          <div className="mt-2">
            <Input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {testingItems.length > 0
              ? testingItems.map((item: TestingRouteDTO, index) => (
                  <Card
                    key={index}
                    className={`flex items-center justify-between p-3 ${
                      Math.abs(
                        item.my_total_distance - item.osrm_total_distance
                      ) /
                        1000 >
                      2 // more than 2km
                        ? "bg-red-200"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col">
                      <div>
                        {item.start_city} -{">"} {item.end_city}
                      </div>
                      <div className="text-sm text-gray-600">
                        Distance Diff:{" "}
                        {(
                          (item.my_total_distance - item.osrm_total_distance) /
                          1000
                        ).toFixed(2)}{" "}
                        km
                      </div>
                      <div className="text-sm text-gray-600">
                        Time Diff:{" "}
                        {(
                          (item.my_total_time - item.osrm_total_time) /
                          3600
                        ).toFixed(2)}{" "}
                        h
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
              : undefined}
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70} className="pl-4 overflow-y-auto">
          {mapData.length > 0 ? (
            <div className="mt-6 border rounded-lg shadow-md overflow-hidden">
              <TestingMap data={mapData} isLoading={isLoading} />
            </div>
          ) : (
            <TestingForm setRefresh={setTestingRefresh} />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default TestingPage;
