import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { cn } from "@/lib/utils";

interface ReactionsProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  onChange?: (reaction: string) => void;
}

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) return null;

  return (
    <div className="flex items-center gap-1 mt-1 mb-1">
      {data.map((reaction) => (
        <button
          className={cn(
            "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex-items-center gap-x-1",
            reaction.memberIds.includes(currentMemberId) &&
            "bg-blue-100/70 border-blue-500 text-white"
          )}
        >
          {reaction.value}
          <span>{reaction.count}</span>
        </button>
      ))}
    </div>
  );
};
