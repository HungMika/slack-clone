"use client";

import { useEffect } from "react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkSpace({ id: workspaceId });
  useEffect(() => {
    console.log(data);
  }, [data]);
  return <div>workspace ID</div>;
};
export default WorkspaceIdPage;
