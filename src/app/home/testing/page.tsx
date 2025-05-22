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

export type routedto = {
  start_city: string;
  end_city: string;
  start_coord: string;
  end_coord: string;
  osrm_accumulated_routes	: string;
  osrm_total_time: number;
  osrm_total_distance	: number;
  my_accumulated_routes: string[];
  my_accumulated_charging_stops: string[];
  my_total_distance: number;
  my_total_time: number;
};


const TestingPage = () => {
  // List of items on the left panel
  const [testingItems, setTestingItems] = useState<Array<routedto>>([]);
  // Selected checkboxes in the list
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<Set<routedto>>(
    new Set()
  );
  // Data fetched from backend for selected checkboxes, used as data source for map
  const [mapData, setMapData] = useState<Array<routedto>>([]);
  // Loading state for data fetching
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Search filter text
  const [searchText, setSearchText] = useState<string>("");

  const [testingRefresh, setTestingRefresh] = useState(false);

  // Fetch initial list of items on mount
  useEffect(() => {
    let params = new Object() as any;
    params["search"] = searchText;

    API_POST(
      "graphs/testing/items/query",
      params,
      (result: Array<routedto>) => {
        if (result?.length) setTestingItems(result);
        setTestingRefresh(false);
      }
    );
  }, [testingRefresh, searchText]);

  const fetchDataForCheckbox = (item: routedto) => {
    let params = new Object() as any;
    params["start_city"] = item.start_city;
    params["end_city"] = item.end_city;

    setIsLoading(true);
    API_POST("graphs/testing/query", params, (result: routedto) => {
      setIsLoading(false);
      setMapData((prevData) => {
        prevData.push(result);
        return prevData;
      });
    });
  };

  const onCheckboxChange = (item: routedto, checked: boolean) => {
    setSelectedCheckboxes((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(item);
        fetchDataForCheckbox(item);
      } else {
        newSet.delete(item);
        setMapData((prevData) =>
          prevData.filter(
            (d) =>
              d.start_city !== item.start_city && d.end_city !== item.end_city
          )
        );
      }
      return newSet;
    });
  };

  const onAddNew = () => {
    // Logic for adding new item can be implemented here
    // For now, just clear selections and map data
    setSelectedCheckboxes(new Set());
    setMapData([]);
  };

  return (
    <div className="h-full p-4">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={30}
          className="space-y-4 pr-4 border-r border-gray-200 flex flex-col"
        >
          <div className="flex items-center space-x-2">
            <Card
              className="bg-green-200 hover:bg-green-300 cursor-pointer flex items-center justify-center space-x-2 transition-shadow shadow-sm hover:shadow-lg flex-shrink-0"
              onClick={onAddNew}
            >
              <CardContent className="flex gap-2 p-3">
                <PlusIcon className="text-stone-800" size={24} />
                <span className="font-semibold text-stone-800">Add Item</span>
              </CardContent>
            </Card>
            <Input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-grow"
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {testingItems.length > 0
              ? testingItems.map((item: routedto, index) => (
                  <Card
                    key={index}
                    className="flex items-center justify-between p-3"
                  >
                    <div>
                      {item.start_city} -{">"} {item.end_city}
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedCheckboxes.has(item)}
                      onChange={(e) => onCheckboxChange(item, e.target.checked)}
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
