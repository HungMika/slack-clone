"use client";

import React from "react";
import { Toolbar } from "./toolbar";
import { SideBar } from "./sidebar";
import { WorkSpaceSideBar } from "./workspace-sidebar";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface WorkspaceIdLayOutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayOut = ({ children }: WorkspaceIdLayOutProps) => {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <SideBar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="ca-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5e2c5f]"
          >
            <WorkSpaceSideBar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdLayOut;
