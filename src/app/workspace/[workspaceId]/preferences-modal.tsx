import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { useUpdateWorkSpace } from "@/features/workspaces/api/use-update-workspace";
import { useRemoveWorkSpace } from "@/features/workspaces/api/use-remove-workspace";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

export const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) => {
  const [value, setValue] = useState(initialValue);
  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkSpace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkSpace();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 bg-gray-50 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-white">
          <DialogTitle>{value}</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4 flex flex-col gap-y-2">
          <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold">Workspace name</p>
              <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                Edit
              </p>
            </div>
            <p className="text-sm">{value}</p>
          </div>
          <button
            onClick={() => {}}
            className="
            flex items-center gap-x-2 px-5 py-4 rounded-lg border
          bg-white cursor-pointer hover:bg-gray-50 text-red-600"
          >
            <TrashIcon className="size-4" />
            <p className="text-sm font-semibold">Delete workspace</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
