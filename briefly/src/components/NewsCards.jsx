import ThemeToggle from "./ThemeToggle";

export default function NewsCards() {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
        <div className="flex-column gap-2 flex-1">
          <div className="h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}