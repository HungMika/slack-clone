"use client";

import React from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { UserButton } from "@/features/auth/components/user-button";

export default function Home() {
  const { signOut } = useAuthActions();
  return (
    <div>
      Logged In
      <UserButton />
    </div>
  );
}
