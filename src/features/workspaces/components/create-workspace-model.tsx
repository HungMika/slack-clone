"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspaceAtom } from "../store/use-create-workspace-model";

export const CreateWorkspaceModel = () => {
  const [open, setOpen] = useCreateWorkspaceAtom();
  const handleClose = () => {
    //TODO: handle close
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add some fking workspaces</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" action="submit">
          <Input
            value=""
            disabled={false}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g 'Work', thats all"
          />
          <div className="flex justify-end">
            <Button disabled={false}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
