"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <motion.button
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-400 bg-slate-800 p-2 shadow-inner hover:shadow-lg",
        "dark:bg-slate-100",
        "transition-colors duration-200"
      )}
      whileTap={{
        scale: 0.95,
        rotate: 15,
      }}
      whileHover={{
        scale: 1.1,
      }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6 text-slate-200 dark:text-slate-800"
      >
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          strokeLinecap="round"
          strokeLinejoin="round"
          d={
            theme === "dark"
              ? "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              : "M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          }
        />
      </motion.svg>
      <span className="sr-only">Toggle theme</span>
    </motion.button>
  );
};

export default ThemeToggle;
