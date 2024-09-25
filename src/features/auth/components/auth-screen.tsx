"use client";

import React, { useState } from "react";

import { SignInflow } from "../types";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";

export const AuthScreen = () => {
  const [state, setState] = useState<SignInflow>("signIn");

  return (
    <div className="h-full flex items-center justify-center bg-[#5c3b58]">
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" ? (
          <SignInCard setstate={setState} />
        ) : (
          <SignUpCard setstate={setState} />
        )}
      </div>
    </div>
  );
};
