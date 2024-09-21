import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback } from "react";

type Request = any;
type Response = any;

type Options = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export const useCreateWorkspace = () => {
  const mutation = useMutation(api.workspaces.create);

  const mutate = useCallback(
    async (values: any, options?: Options) => {
      try {
        const response = await mutation(values);
        options?.onSuccess?.();
      } catch {
        options?.onError?.();
      } finally {
        options?.onSettled?.();
      }
    },
    [mutation]
  );
  return { mutate };
};
