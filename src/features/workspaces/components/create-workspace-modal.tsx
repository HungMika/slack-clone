"use client";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCreateWorkSpaceModal } from "../store/use-create-workspace-modal";
import { useCreateWorkSpace } from "../api/use-create-workspace";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const CreateWorkSpaceModal = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkSpaceModal();
  const [name, setName] = useState("");
  const { mutate, isPending } = useCreateWorkSpace();

  const handleClose = () => {
    setOpen(false);
    //TODO: clear form
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name },
      {
        onSuccess(workspaceId) {
          console.log(workspaceId);
          toast.success("Workspace created !!!");
          router.push(`/workspace/${workspaceId}`);
          setOpen(false);
        },
      },
    );
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add a Workspace</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              required
              autoFocus
              minLength={3}
              placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
            />
            <div className="flex justify-end">
              <Button disabled={isPending}>Create</Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
