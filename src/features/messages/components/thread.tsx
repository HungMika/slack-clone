import { useEffect, useRef, useState } from "react";

import Quill from "quill";
import { toast } from "sonner";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";

import { Message } from "@/components/message";
import { useChannelId } from "@/hooks/use-channel-id";
import { UseGetMessages } from "../api/use-get-message";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateMessage } from "../api/use-create-message";
import { useGetSingleMessage } from "../api/use-get-single-message";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useMessageSeen } from "../api/use-message-seen";
import { useCurrentUser } from "@/features/auth/api/use-current-user";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const TIME_THREDHOLD = 5;
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

const formatDateLabel = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) {
    return "Today";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  return format(date, "EEEEE, MMM d");
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
  const { results, status, loadMore } = UseGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";
  const currentUser = useCurrentUser();
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
  const { mutate: messageSeenUpdate } = useMessageSeen(); // Gọi hook để lấy hàm mutate trước

  const handleUpdateSeen = async () => {
    console.log("handleUpdateSeen", results);

    for (const result of results) {
      // Sử dụng for...of để tuần tự xử lý
      const seenMembers = result.seenMembers;
      if (!seenMembers) {
        continue;
      }

      if (currentUser.data && seenMembers.includes(currentUser.data._id)) {
        const finalArray = seenMembers.filter(
          (member) => member !== currentUser.data?._id
        );

        // Sử dụng mutate như một hàm thông thường
        await messageSeenUpdate({
          id: result._id,
          seenMembers: finalArray,
        });
      }
    }
  };
  useEffect(() => {
    handleUpdateSeen();
  }, [results]);
  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof results>
  );

  if (loadingMessage || status === "LoadingFirstPage") {
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
    <div className="h-full flex flex-col text-black">
      <div className="h-[49px] flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isCompact =
                prevMessage &&
                prevMessage.user?._id === message.user?._id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(prevMessage._creationTime)
                ) < TIME_THREDHOLD;

              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorImage={message.user.image}
                  authorName={message.user.name}
                  isAuthor={message.memberId === currentMember?._id}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadName={message.threadName}
                  threadTimestamp={message.threadTimestamp}
                />
              );
            })}
          </div>
        ))}
        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entries]) => {
                  if (entries.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                {
                  threshold: 1,
                }
              );
              observer.observe(el);
              return () => {
                observer.disconnect();
              };
            }
          }}
        />
        {isLoadingMore && (
          <div>
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="animate-spin" />
            </span>
          </div>
        )}
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
