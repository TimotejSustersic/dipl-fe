"use client";

import { API_POST } from "@/components/API/utils";
import { useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const Maps = () => {
  useEffect(() => {
    console.log("effect");
    API_POST(
      "graphs/test/",
      {
        user_name: "string",
      },
      (result) => {
        console.log(result);
      }
    );
  }, []);

  return (
    <div className="h-full p-2">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40}>
          <div>levo</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <div>desno</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Maps;
