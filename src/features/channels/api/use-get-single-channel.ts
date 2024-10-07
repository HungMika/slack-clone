import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetSingleChannelProps {
  id: Id<"channels">;
}

export const useGetSingleChannel = ({ id }: UseGetSingleChannelProps) => {
  const data = useQuery(api.channels.getById, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
