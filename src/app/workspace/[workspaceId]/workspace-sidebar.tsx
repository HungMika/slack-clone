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

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetChannel } from "@/features/channels/api/use-get-channels";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

export const WorkSpaceSideBar = () => {
  const workspaceId = useWorkspaceId();
  const [_isOpen, setIsOpen] = useCreateChannelModal();

  const { data: channels, isLoading: channelsLoading } = useGetChannel({
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
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizonal} id="drafts" />
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
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Messages"
        hint="New direct message"
        onNew={() => {}}
      >
        {members?.map((item) => (
          <div>
            <UserItem
              id={item._id}
              key={item._id}
              image={item.user.image}
              label={item.user.name}
            />
          </div>
        ))}
      </WorkspaceSection>
    </div>
  );
};
