import { useMemberId } from "@/hooks/use-member-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetSingleMember } from "@/features/members/api/use-get-single-member";
import { UseGetMessages } from "@/features/messages/api/use-get-message";
import { Header } from "./header";
import { Loader } from "lucide-react";
import { ChatInput } from "./chat-input";
import { MessageList } from "@/components/message-list";

interface ConversationProps {
  id: Id<"conversations">;
}

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const { data: member, isLoading: memberLoading } = useGetSingleMember({
    id: memberId,
  });
  const { results, status, loadMore } = UseGetMessages({ conversationId: id });

  if (memberLoading || status === "LoadingFirstPage")
    return (
      <div className="h-full flex items-center jusitfy-center">
        <Loader className="size-6 animate-spin text-muted-foreground"></Loader>
      </div>
    );

  return (
    <div className="flex felx-col h-full">
      <Header
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => {}}
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
