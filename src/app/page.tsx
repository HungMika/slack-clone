"use client";

import React, { useEffect, useMemo } from "react";
import { UserButton } from "@/features/auth/components/user-button";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceAtom } from "@/features/workspaces/store/use-create-workspace-model";

export default function Home() {
  const [open, setOpen] = useCreateWorkspaceAtom();

  const { data, isLoading } = useGetWorkspaces();

  const workspacesId = useMemo(() => data?.[0]?._id, [data]);
  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (workspacesId) {
      console.log(workspacesId, "there work space data");
    } else if (!open) {
      setOpen(true);
      console.log("at least it's in ");
    }
  }, [workspacesId, isLoading, open, setOpen]);

  return (
    <div>
      <UserButton />
    </div>
  );
}
