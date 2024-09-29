import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";

import { toast } from "sonner";
import { CopyIcon, RefreshCcw } from "lucide-react";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useNewJoinCode();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    "This will revoke the current join code and generate a new one.",
  );

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/join/${joinCode}`)
      .then(() => toast.success("Link copied to clipboard"));
  };
  const handleRefreshCode = async () => {
    const ok = await confirm();
    if (!ok) return;
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
      },
    );
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <ConfirmDialog />
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Invite people to {name}</DialogTitle>
          <DialogDescription>
            Use the below code to invite people to your workspace
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-y-4 py-4 justify-center">
          <p className="text-4xl font-bold tracking-widest uppercase">
            {joinCode}
          </p>
          <Button onClick={handleCopyLink} variant={"ghost"}>
            Copy link
            <CopyIcon className="size-4 ml-2" />
          </Button>
        </div>
        <div className="flex items-center justify-between w-full">
          <Button
            disabled={isPending}
            onClick={handleRefreshCode}
            variant={"outline"}
          >
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
