import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkSpace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkSpaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkSpaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [_open, setOpen] = useCreateWorkSpaceModal();
  //rename the var
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkSpaces();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkSpace({
    id: workspaceId,
  });

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId,
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-sl">
          {workspaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className="currsor-pointer flex-col justify-start items-start capitalize"
        >
          {workspace?.name}
          <span className="text-xs text-muted-foreground">
            Active workspace
          </span>
        </DropdownMenuItem>
        {filteredWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace?._id}
            onClick={() => router.push(`/workspace/${workspace?._id}`)}
            className="currsor-pointer capitalize overflow-hidden truncate"
          >
            <div className="shrink-0 size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2">
              {workspace?.name.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">{workspace?.name}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
            <Plus />
          </div>
          Create new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};