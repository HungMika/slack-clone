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
      isShow: true,
      label: "Reaction",
      icon: <Smile className="size-4" />,
      hoverOption: "popphover",
      onClick: handleReaction,
    },
    {
      isShow: !hideThreadButton,
      label: "Edit",
      icon: <Pencil className="size-4" />,
      onClick: handleEdit,
    },
    {
      isShow: !hideThreadButton,
      label: "Delete",
      icon: <Trash className="size-4" />,
      onClick: handleDelete,
    },
    {
      isShow: !hideThreadButton,
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
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label={`Reply in thread`}>
            <Button
              variant={"ghost"}
              size={"iconSm"}
              disabled={isPending}
              onClick={handleThread}
            >
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label={`Edit message`}>
            <Button
              variant={"ghost"}
              size={"iconSm"}
              disabled={isPending}
              onClick={handleEdit}
            >
              <Pencil className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label={`Delete message`}>
            <Button
              variant={"ghost"}
              size={"iconSm"}
              disabled={isPending}
              onClick={handleDelete}
            >
              <Trash className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  );
};
