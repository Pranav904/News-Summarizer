import ThemeToggle from "./ThemeToggle";
import Recommendations from "./Recommendations";
import { Alex_Brush } from "@next/font/google";

const alexBrush = Alex_Brush({
  weight: "400",
  subsets: ["latin"],
});

export default function NewsCards({ userProfile, selectedTags }) {
  return (
    <div className="flex flex-1 overflow-y-auto ">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex justify-between hidden sm:block">
          <h1
            className={`${alexBrush.className} text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50`}
          >
            Briefly
          </h1>
          {/* <p className={`${alexBrush.className} invisible text-2xl sm:visible`}>Welcome !</p> */}
          {/* <ThemeToggle /> */}
        </div>
        <Recommendations selectedTags={selectedTags} />
      </div>
    </div>
  );
}
