import React, { useState } from "react";
import { Info, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMember } from "@/features/members/api/use-get-member";
import Link from "next/link";
import { useRouter } from "next/navigation";
export const Toolbar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkSpace({ id: workspaceId });
  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMember({ workspaceId });

  const [open, setOpen] = useState(false);

  const onChannelClick = (channelId: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };
  const onMemberClick = (memberId: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };


  return (
    <nav className="bg-[#481349] flex items-center justify-between p-1.5 h-10">
      <div className="flex-1" />
      <div className="min-w-[280px] max-[620px] grow-[2] shrink">
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="bg-accent/25 hover:bg-accent-25 w-full h-7 justify-start"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {data?.name}</span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem key={channel._id}>
                  <div
                    className="w-full"
                    onClick={() => {
                      onChannelClick(channel._id);
                    }}
                  >
                    {channel.name}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem key={member._id}>
                  <div
                    className="w-full"
                    onClick={() => onMemberClick(member._id)}
                  >
                    {member.user.name}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};