"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateWorkspaceAtom } from "../store/use-create-workspace-model";

export const CreateWorkspaceModel = () => {
  const [open, setOpen] = useCreateWorkspaceAtom();
  const handleClose = () => {
    //TODO: handle close
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>Add some fking workspaces</DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
