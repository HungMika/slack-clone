import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { XIcon } from "lucide-react";

interface ThumbnailProps {
  url: string | null | undefined;
}

export const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) {
    return null;
  }
  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
          <img
            src={url}
            alt={"Message IMG"}
            className="rounded-md object-cover size-full"
          ></img>
        </div>
      </DialogTrigger>
      <DialogContent>
        <img
          src={url}
          alt={"Message IMG"}
          className="rounded-md object-cover size-full"
        ></img>
      </DialogContent>
    </Dialog>
  );
};
