import Quill, { QuillOptions } from "quill";
import { MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";
import "quill/dist/quill.snow.css";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ImageIcon, Smile } from "lucide-react";
const Editor = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const option: QuillOptions = {
      theme: "snow",
    };

    const quill = new Quill(editorContainer, option);
    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);
  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-e overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        skjashdjkashd
        <div className="flex px-2 pb-2 z-[5]">
          <Button
            disabled={false}
            size="iconSm"
            variant="ghost"
            onClick={() => {}}
          >
            <PiTextAa className="size-4" />
          </Button>
          <Button
            disabled={false}
            size="iconSm"
            variant="ghost"
            onClick={() => {}}
          >
            <Smile className="size-4" />
          </Button>
          <Button
            disabled={false}
            size="iconSm"
            variant="ghost"
            onClick={() => {}}
          >
            <ImageIcon className="size-4" />
          </Button>
          <Button
            disabled={false}
            onClick={() => {}}
            size="iconSm"
            className="ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white "
          >
            <MdSend className="size-4" />
          </Button>
        </div>
        <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
          <p>
            <strong>Shift + Return</strong> to add new line
          </p>
        </div>
      </div>
    </div>
  );
};
export default Editor;
