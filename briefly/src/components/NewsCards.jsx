import ThemeToggle from "./ThemeToggle";
import Recommendations from "./Recommendations";

export default function NewsCards({ userProfile }) {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex justify-center">
        <p>Welcome, {userProfile.nickname} !</p>
          <ThemeToggle />
        </div>
        <div className="container mx-auto p-6 min-h-screen">
          <Recommendations/>
        </div>
      </div>
    </div>
  );
}