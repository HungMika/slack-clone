import { useMemberId } from "@/hooks/use-member-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetSingleMember } from "@/features/members/api/use-get-single-member";
import { UseGetMessages } from "@/features/messages/api/use-get-message";
import { Header } from "./header";
import { Loader } from "lucide-react";
import { ChatInput } from "./chat-input";
import { MessageList } from "@/components/message-list";
import { usePanel } from "@/hooks/use-panel";
import { useMessageSeen } from "@/features/messages/api/use-message-seen";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useEffect } from "react";

interface ConversationProps {
  id: Id<"conversations">;
}

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const currentUser = useCurrentUser();

  const { onOpenProfile } = usePanel();

  const { data: member, isLoading: memberLoading } = useGetSingleMember({
    id: memberId,
  });
  const { results, status, loadMore } = UseGetMessages({ conversationId: id });
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
  if (memberLoading || status === "LoadingFirstPage")
    return (
      <div className="h-full flex items-center jusitfy-center">
        <Loader className="size-6 animate-spin text-purple-800"></Loader>
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => onOpenProfile(memberId)}
      />
      <MessageList
        data={results}
        variant="conversation"
        memberName={member?.user.name}
        memberImage={member?.user.image}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput
        placeholder={`Message ${member?.user.name}`}
        converationId={id}
      />
    </div>
  );
};
