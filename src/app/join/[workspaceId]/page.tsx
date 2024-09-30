"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader } from "lucide-react";
import VerificationInput from "react-verification-input";

import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkSpaceInfo } from "@/features/workspaces/api/use-get-workspace-info";

const JoinPage = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkSpaceInfo({ id: workspaceId });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-pulse text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src="/logo.svg" width={60} height={60} alt="Logo" />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join workspace</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          length={6}
          autoFocus
          classNames={{
            container: "flex gap-x-2",
            character:
              "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
        />
      </div>
      <div className="flex gap-x-4">
        <Button size={"lg"} variant={"outline"} asChild>
          <Link href={"/"}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
