import { Button } from "@/components/ui/button";
import React, { use, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FaChevronCircleDown } from "react-icons/fa";
interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick: () => void;
}

export const Header = ({
  memberImage,
  memberName = "member",
  onClick,
}: HeaderProps) => {
  const avatarFallBacck = memberName.charAt(0).toUpperCase();

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button
        variant={"ghost"}
        className="text-lg  font-semibold px-2 overflow-hidden w-auto"
        size={"sm"}
        onClick={onClick}
      >
        <Avatar className="size-6 mr-2">
          <AvatarImage src={memberImage} />
          <AvatarFallback>{avatarFallBacck}</AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <FaChevronCircleDown className="size-2.5 ml-2" />
      </Button>
    </div>
  );
};
