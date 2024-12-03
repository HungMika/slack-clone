import { useRef, useState } from "react";

import Quill from "quill";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";

import { Message } from "@/components/message";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateMessage } from "../api/use-create-message";
import { useGetSingleMessage } from "../api/use-get-single-message";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image: Id<"_storage"> | undefined;
};

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: loadingMessage } = useGetSingleMessage({
    id: messageId,
  });

  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    console.log({ body, image }, "message");
    editorRef.current?.enable(false);

    try {
      setIsPending(true);
      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        parentMessageId: messageId,
        body,
        image: undefined,
      };
      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        console.log({ url });

        if (!url) {
          throw new Error("Failed to generate upload url");
        }
        const result = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": image.type,
          },
          body: image,
        });
        console.log({ result });
        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }
      await createMessage(values, { throwError: true });
      setEditorKey((prev) => prev + 1);
    } catch (e) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };

  if (loadingMessage) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No messages found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-[49px] flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div>
        <Message
          hideThreadButton
          memberId={message.memberId}
          authorName={message.user.name}
          authorImage={message.user.image}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      </div>
      <div className="px-4">
        <Editor
          key={editorKey}
          onSubmit={handleSubmit}
          innerRef={editorRef}
          disabled={false}
          placeholder="Write a reply..."
        />
      </div>
    </div>
  );
};
