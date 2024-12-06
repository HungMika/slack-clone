import { useMemberId } from "@/hooks/use-member-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetSingleMember } from "@/features/members/api/use-get-single-member";
import { UseGetMessages } from "@/features/messages/api/use-get-message";
import { Header } from "./header";
import { Loader } from "lucide-react";

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
    </div>
  );
};
