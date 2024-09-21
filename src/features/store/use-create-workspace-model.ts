import { atom, useAtom } from "jotai";

const modelAtom = atom(false);

export const useCreateWorkspaceAtom = () => {
  return useAtom(modelAtom);
};
