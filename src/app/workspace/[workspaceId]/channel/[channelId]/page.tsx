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
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useMessageSeen } from "@/features/messages/api/use-message-seen";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { results, status, loadMore } = UseGetMessages({ channelId });
  const currentUser = useCurrentUser();
  const workspaceId = useWorkspaceId();
  const currentMember = useCurrentMember({ workspaceId });
  const { data: singleChannel, isLoading: singleChannelLoading } =
    useGetSingleChannel({ id: channelId });

  const { mutate: useMessageSeenUpdate } = useMessageSeen();
  const handleUpdateSeen = () => {
    console.log("handleUpdateSeen",results);
    results.forEach(async (result) => {
      let seenMembers = result.seenMembers;
      if (!seenMembers) {
        return;
      }

      if (currentUser.data && seenMembers.includes(currentUser.data._id)) {
        console.log(
          "needed update seen ",
          result._id,
          "for user ",
          currentMember.data?._id
        );
        const finalArray = seenMembers.filter(
          (member) => member !== currentUser.data?._id
        );
        await useMessageSeenUpdate({
          id: result._id,
          seenMembers: finalArray,
        });
      }
    });
  };
  
  useEffect(() => {
    handleUpdateSeen();
  }, [results]);
  // handleUpdateSeen();

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
    <div className="flex flex-col h-full text-black">
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
