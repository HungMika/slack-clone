"use client";

import React from "react";
import { Toolbar } from "./toolbar";
import { SideBar } from "./sidebar";

interface WorkspaceIdLayOutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayOut = ({ children }: WorkspaceIdLayOutProps) => {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <SideBar />
        {children}
      </div>
    </div>
  );
};

export default WorkspaceIdLayOut;
