import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetSingleMessageProps {
  id: Id<"messages">;
}

export const useGetSingleMessage = ({ id }: UseGetSingleMessageProps) => {
  const data = useQuery(api.messages.getById, { id });
  console.log(data);
  const isLoading = data === undefined;

  return { data, isLoading };
};
