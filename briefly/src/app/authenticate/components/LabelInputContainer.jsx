// LabelInputContainer.js
"use client";
import React from "react";
import { cn } from "@/app/lib/utils";

export default function LabelInputContainer({ children, className }) {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
}
