"use client";

import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useEffect } from "react";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkSpace({ id: workspaceId });
  useEffect(() => {
    console.log(data);
  }, [data]);
  return <div>ID: {JSON.stringify(data)}</div>;
};
export default WorkspaceIdPage;
