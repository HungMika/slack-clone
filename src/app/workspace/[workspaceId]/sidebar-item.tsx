import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const sidebarItemVariant = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SidebarItemProps {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof sidebarItemVariant>["variant"];
  notifications?: number;
}

export const SidebarItem = ({
  notifications,
  label,
  icon: Icon,
  id,
  variant,
}: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();

  const handleClick = () => {
    if (!id) {
      toast.error("Sorry, this function is updating.");
    }
  };

  return id ? (
    <Button
      variant="transparent"
      size="sm"
      className={cn(sidebarItemVariant({ variant }))}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
        {notifications&&notifications>0 ? (
          <span className="ml-auto text-xs bg-[#481349] rounded w-4 h-4 flex items-center justify-center">
            {notifications}
          </span>
        ) : null}
      </Link>
    </Button>
  ) : (
    <Button
      variant="transparent"
      size="sm"
      className={cn(sidebarItemVariant({ variant }))}
      onClick={handleClick}
    >
      <Icon className="size-3.5 mr-1 shrink-0" />
      <span className="text-sm truncate">{label}</span>
 
    </Button>
  );
};
