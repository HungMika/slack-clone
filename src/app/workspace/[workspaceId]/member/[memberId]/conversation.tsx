import { useMemberId } from "@/hooks/use-member-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetSingleMember } from "@/features/members/api/use-get-single-member";
import { UseGetMessages } from "@/features/messages/api/use-get-message";

interface ConversationProps {
  id: Id<"conversations">;
}

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const { data: member, isLoading: memberLoading } = useGetSingleMember({
    id: memberId,
  });
  const { results, status, loadMore } = UseGetMessages({ conversationId: id });

  if (memberLoading) return <div>Loading...</div>;

  return <div>Conversation</div>;
};
