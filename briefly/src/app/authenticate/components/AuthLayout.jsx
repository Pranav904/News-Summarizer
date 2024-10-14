// AuthLayout.js
"use client";
import React from "react";
import { cn } from "@/app/lib/utils";
import { motion } from "framer-motion";

export default function AuthLayout({ children, isLogin, switchToLogin, switchToSignUp }) {
  return (
    <div className="h-fit max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <div className="flex justify-center gap-4 mb-6">
        <motion.button
          onClick={switchToLogin}
          className={cn(
            "w-full rounded-md py-2 font-medium transition-colors",
            isLogin
              ? "bg-black text-white dark:bg-zinc-900 dark:text-zinc-200"
              : "bg-transparent text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>
        <motion.button
          onClick={switchToSignUp}
          className={cn(
            "w-full rounded-md py-2 font-medium transition-colors",
            !isLogin
              ? "bg-black text-white dark:bg-zinc-900 dark:text-zinc-200"
              : "bg-transparent text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign Up
        </motion.button>
      </div>

      {children}
    </div>
  );
}