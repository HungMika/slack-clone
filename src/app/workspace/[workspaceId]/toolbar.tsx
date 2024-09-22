import { Button } from "@/components/ui/button";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Info, Search } from "lucide-react";
import React from "react";

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkSpace({ id: workspaceId });

  return (
    <nav className="bg-[#481349] flex items-center justify-between p-1.5 h-10">
      <div className="flex-1" />
      <div className="min-w-[280px] max-[620px] grow-[2] shrink">
        <Button
          size="sm"
          className="bg-accent/25 hover:bg-accent-25 w-full h-7 justify-start"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search workspace</span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
