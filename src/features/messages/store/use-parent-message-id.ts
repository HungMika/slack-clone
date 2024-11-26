import { useQueryState } from "nuqs";

export const useParentMessageId = () => {
  return useQueryState("parentMessageId", {
    parse: (value) => {
      console.log("yoooooooo");
      return value;
    },
    defaultValue: null,
  });
};
