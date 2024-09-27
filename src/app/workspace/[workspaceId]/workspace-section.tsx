import React from "react";
import { useToggle } from "react-use";
import { PlusIcon } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WorkspaceSectionProps {
  children: React.ReactNode;
  label: string;
  hint: string;
  onNew: () => void;
}

export const WorkspaceSection = ({
  children,
  label,
  hint,
  onNew,
}: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(true);

  return (
    <div className="flex flex-col mt-3 px-2">
      <div className="flex items-center px-3.5 group">
        <Button
          onClick={toggle}
          variant="transparent"
          className="p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6"
        >
          <FaCaretDown
            className={cn("size-4 transition-transform", on && "-rotate-90")}
          />
        </Button>
        <Button
          size="sm"
          variant="transparent"
          className="text-sm text-[#f9edffcc] h-[28px] items-center justify-start overflow-hidden"
        >
          <span className="truncate">{label}</span>
        </Button>
        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              size="iconSm"
              onClick={onNew}
              variant="transparent"
              className="
              opacity-0 group-hover:opacity-100 transition-opacity 
              ml-auto p-0.5 text-sm text-[#f9edffcc] size-6 shrink-0"
            >
              <PlusIcon className="size-5" />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  );
};
