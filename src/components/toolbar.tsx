import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Hint } from "./hint";
import { EmojiPopover } from "./emoji-popover";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleDelete: () => void;
  handleThread: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
}

export const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleDelete,
  handleThread,
  handleReaction,
  hideThreadButton,
}: ToolbarProps) => {
  // refactor code to use array of object
  const allButton = [
    {
      label: "Reaction",
      icon: <Smile className="size-4" />,
      hoverOption: "popphover",
      onClick: handleReaction,
    },
    {
      label: "Edit",
      icon: <Pencil className="size-4" />,
      onClick: handleEdit,
    },
    {
      label: "Delete",
      icon: <Trash className="size-4" />,
      onClick: handleDelete,
    },
    {
      label: "Thread",
      icon: <MessageSquareTextIcon className="size-4" />,
      onClick: handleThread,
    },
  ];

  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover onEmojiSelect={(emoji) => handleReaction(emoji.native)}>
          <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
            <Smile className="size-4" />,
          </Button>
        </EmojiPopover>

        <Hint label={`edit messages`}>
          <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
            <MessageSquareTextIcon className="size-4" />
          </Button>
        </Hint>

        {!hideThreadButton && (
          <Hint label={`edit messages`}>
            <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
              <Pencil className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label={`edit messages`}>
            <Button variant={"ghost"} size={"iconSm"} disabled={isPending}>
              <Trash className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  );
};
