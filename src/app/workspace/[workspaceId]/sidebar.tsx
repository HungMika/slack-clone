import React from "react";
import { SideBarButton } from "./sidebar-button";
import { WorkspaceSwitcher } from "./workspace-switcher";

import { usePathname, useSearchParams } from "next/navigation";
import { UserButton } from "@/features/auth/components/user-button";
import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react";

export const SideBar = () => {
  const pathname = usePathname();
  const querys = useSearchParams()
  
  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <WorkspaceSwitcher />
      <SideBarButton
        icon={Home}
        label="Home"
        isActive={pathname.includes("/workspace")&&!querys.toString().includes("notifications")}
      />
      <SideBarButton icon={MessagesSquare} label="DMs" />
      <SideBarButton
        icon={Bell}
        label="Activity"
        isActive={querys.toString().includes("notifications")}
      />
      <SideBarButton icon={MoreHorizontal} label="More" />

      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};