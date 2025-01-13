import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Id } from "../../../../convex/_generated/dataModel";
import { cva, type VariantProps } from "class-variance-authority";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const userItemVariant = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
  {
    variants: {
      variants: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variants: "default",
    },
  },
);

interface UserItemProps {
  id: Id<"members">;
  variant?: VariantProps<typeof userItemVariant>["variants"];
  label?: string;
  notifications?: number;
  image?: string;
}

export const UserItem = ({
  notifications,
  id,
  variant,
  label = "Member",
  image,
}: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  const avatarFallback = label.charAt(0).toUpperCase();

  return (
    <Button
      asChild
      size="sm"
      variant="transparent"
      className={cn(userItemVariant({ variants: variant }))}
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage className="rounded-md" src={image} />
          <AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{label}</span>
        {notifications&&notifications>0 ? (
          <span className="ml-auto text-xs bg-red-500 rounded w-4 h-4 flex items-center justify-center">
            {notifications}
          </span>
        ) : null}
      </Link>
    </Button>
  );
};