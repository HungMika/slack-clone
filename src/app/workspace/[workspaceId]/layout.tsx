"use client";

import React from "react";
import { Toolbar } from "./toolbar";

interface WorkspaceIdLayOutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayOut = ({ children }: WorkspaceIdLayOutProps) => {
  return (
    <div className="h-full">
      <Toolbar />
      {children}
    </div>
  );
};

export default WorkspaceIdLayOut;
