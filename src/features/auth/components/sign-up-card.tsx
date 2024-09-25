import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { TriangleAlert } from "lucide-react";

import { SignInflow } from "../types";
import React, { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

interface SignUpCardProps {
  setstate: (state: SignInflow) => void;
}

export const SignUpCard = ({ setstate }: SignUpCardProps) => {
  const { signIn } = useAuthActions();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setPending(true);
    signIn("password", { name, email, password, flow: "signUp" })
      .catch(() => {
        setError("Something went wrong");
      })
      .finally(() => {
        setPending(false);
      });
  };

  const onProviderSignUp = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => setPending(false));
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign Up to continue</CardTitle>
        <CardDescription className="px-0 pt-0">
          use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div
          className="
      bg-destructive/15 
      rounded-md flex p-3
      items-center gap-x-2
      text-sm text-destructive mb-6"
        >
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={onPasswordSignUp}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={pending}
            placeholder="Name"
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={pending}
            type="email"
            placeholder="Email"
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={pending}
            type="password"
            placeholder="Password"
          />
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={pending}
            type="password"
            placeholder="Confirm password"
          />
          <Button type="submit" className="w-full" disabled={pending} size="lg">
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5 ">
          <Button
            disabled={pending}
            onClick={() => onProviderSignUp("google")}
            className="w-full relative "
            variant={"outline"}
            size="lg"
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            Continue with Google
          </Button>
          <Button
            disabled={pending}
            onClick={() => onProviderSignUp("github")}
            className="w-full relative "
            variant={"outline"}
            size="lg"
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setstate("signIn")}
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
