import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef } from "react";
import { useCreateMessage } from "@/features/messages/api/use-create-message";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface ChatInputProps {
  placeholder?: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  // editorRef.current?.focus()

  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    console.log({ body, image });
  };

  return (
    <div className="px-5 w-full">
      <Editor
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  );
};
