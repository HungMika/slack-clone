"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Loader, TriangleAlert } from "lucide-react";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

const ChannelIdPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: WorkspaceLoading } = useGetWorkSpace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  useEffect(() => {
    if (
      WorkspaceLoading ||
      channelsLoading ||
      memberLoading ||
      !member ||
      !workspace
    ) {
      return;
    }
    // if (channelId) {
    //   router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    // }
    if (!channelId && !open && isAdmin) setOpen(true);
  }, [
    channelId,
    WorkspaceLoading,
    channelsLoading,
    workspace,
    open,
    setOpen,
    workspaceId,
    member,
    memberLoading,
    isAdmin,
    router,
  ]);

  if (WorkspaceLoading || channelsLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!workspace) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">No channel found.</span>
      </div>
    );
  }
};
export default ChannelIdPage;
