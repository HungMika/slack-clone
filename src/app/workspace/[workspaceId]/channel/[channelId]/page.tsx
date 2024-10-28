"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Loader, TriangleAlert } from "lucide-react";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useChannelId } from "@/hooks/use-channel-id";
import { useGetSingleChannel } from "@/features/channels/api/use-get-single-channel";
import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { UseGetMessages } from "@/features/messages/api/use-get-message";
import { MessageList } from "@/components/message-list";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { results, status, loadMore } = UseGetMessages({ channelId });
  const { data: singleChannel, isLoading: singleChannelLoading } =
    useGetSingleChannel({ id: channelId });
  console.log({ results }, "alll the message from channel id ");
  if (singleChannelLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-6 animate-spin text-purple-800" />
      </div>
    );
  }
  if (!singleChannel) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-y-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">No channel found.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={singleChannel.name} />
      <MessageList
        channelName={singleChannel.name}
        channelCreationTime={singleChannel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      ></MessageList>
      <ChatInput placeholder={`Message #${singleChannel.name}`} />
    </div>
  );
};
export default ChannelIdPage;
