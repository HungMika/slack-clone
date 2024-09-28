import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

interface InviteModelProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModel = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModelProps) => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useNewJoinCode();
  const hanldeCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/join/${joinCode}`)
      .then(() => toast.success("Link copied to clipboard"));
  };
  const handleRefreshCode = () => {
    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("New join code generated");
        },
        onError: (error) => {
          console.log(error.message, "error");
          toast.error("Failed to generate new join code");
        },
      }
    );
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite people to</DialogTitle>
          <DialogDescription>
            Use the below code to invite people to {name}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-y-4 py-4 justify-center">
          <p className="text-4xl font-bold tracking-widest uppercase">
            {joinCode}
          </p>
          <Button onClick={hanldeCopyLink} variant={"ghost"}>
            Copy link
            <CopyIcon className="size-4 ml-2" />
          </Button>
        </div>
        <div className="flex items-center justify-between w-full">
          <Button onClick={handleRefreshCode} variant={"outline"}>
            New code
            <RefreshCcw className="size-4 ml-2"></RefreshCcw>
          </Button>
          <DialogClose asChild>
            <Button onClick={() => {}} variant={"outline"}>
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
