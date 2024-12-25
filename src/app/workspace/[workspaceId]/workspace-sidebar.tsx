import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import React from "react";

import { UserItem } from "./user-item";
import { SidebarItem } from "./sidebar-item";
import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceSection } from "./workspace-section";

import { useMemberId } from "@/hooks/use-member-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useSearchParams } from "next/navigation";
import { useGetUserHistory } from "@/features/messages/api/use-get-user-history";
import { useCurrentUser } from "@/features/auth/api/use-current-user";

export const WorkSpaceSideBar = () => {
  const allnotifications = useGetUserHistory();
  const memberId = useMemberId();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const currentUser = useCurrentUser();
  const [_isOpen, setIsOpen] = useCreateChannelModal();

  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkSpace({
    id: workspaceId,
  });
  const { data: members, isLoading: membersLoading } = useGetMember({
    workspaceId,
  });
  const handleFilterNotifications = ({ ChannelId }: { ChannelId: string }) => {
    // NOTE(Khang): this array have all the info of all message related to the current user
    // NOTE(Khang): get the memberID of the user in the channel then from that we can filter out the notifiations
    const memberInChannel = allnotifications?.data?.members.find(
      (member) => member.userId === currentUser.data?._id
    );

    const filteredNotifications = allnotifications?.data?.allConversationInfo?.filter(
      (mess) => {
        const checkIsinChannel = mess.channelId === ChannelId;
        let checkIfMemberSeen = false;
        if (memberInChannel && currentUser.data) {
          checkIfMemberSeen =
            mess?.seenMembers?.includes(currentUser?.data?._id) ?? false;
        }
        return checkIsinChannel && checkIfMemberSeen;
      }
    );
    return filteredNotifications?.length;
  };
  // console.log("debug conser info: ", allnotifications?.data?.arrayWithConversationInfo);
  const handleFilterConvertations = ({
    UserId,
  }: {
    UserId: string;
  }) => {
    const converationInfo = allnotifications?.data?.allConversationInfo?.find(item=>{
      if(!item.conversationInfo) return false
      if(!item.conversationInfo.memberOne?.length) return false
      if(!item.conversationInfo.memberTwo?.length) return false
      return item.conversationInfo?.memberOne[0]?.userId === UserId || item.conversationInfo?.memberTwo[0].userId===UserId
    })

    if(!converationInfo) return 0

    const filteredNotifications = allnotifications?.data?.allConversationInfo?.filter(
      (mess) => {
        const checkIsCon= mess.conversationId === converationInfo.conversationId;
        let checkIfMemberSeen = false;
        if (currentUser.data) {
          checkIfMemberSeen =
            mess?.seenMembers?.includes(currentUser?.data?._id) ?? false;
        }
        return checkIsCon && checkIfMemberSeen
      }
    );
    
    
    return filteredNotifications?.length;
  }
  if (memberLoading || workspaceLoading) {
    return (
      <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }
  if (!member || !workspace) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#5e2c5f] h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizonal} id="" />
      </div>

      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={member.role === "admin" ? () => setIsOpen(true) : undefined}
      >
        {channels?.map((item) => (
          <SidebarItem
            id={item._id}
            key={item._id}
            icon={HashIcon}
            label={item.name}
            variant={channelId === item._id ? "active" : "default"}
            notifications={handleFilterNotifications({ ChannelId: item._id })}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Messages"
        hint="New direct message"
        //onNew={() => {}}
      >
        {members?.map((item) => (
          <div key={item._id}>
            <UserItem
              id={item._id}
              key={item._id}
              image={item.user.image}
              label={item.user.name}
              variant={item._id === memberId ? "active" : "default"}
              notifications = {item.userId === currentUser.data?._id? 0 : handleFilterConvertations({ UserId: item.user._id })}
            />
          </div>
        ))}
      </WorkspaceSection>
    </div>
  )
};
