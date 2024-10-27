// LoginForm.js
"use client";
import React from "react";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import LabelInputContainer from "./LabelInputContainer.jsx";
import BottomGradient from "./BottomGradient";

export default function LoginForm({ handleSubmit }) {
  return (
    <form className="my-8" onSubmit={handleSubmit}>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" placeholder="Email Address" type="email" />
      </LabelInputContainer>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="password">Password</Label>
        <Input id="password" placeholder="Password" type="password" />
      </LabelInputContainer>

      <button
        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        type="submit"
      >
        Login &rarr;
        <BottomGradient />
      </button>
    </form>
  );
}