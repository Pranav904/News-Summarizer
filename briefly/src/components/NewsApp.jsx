import SidebarComponent from "./SideBar";
import NewsCards from "./NewsCards";
import { cn } from "@/app/lib/utils";

export default function NewsApp({ user }) {
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <SidebarComponent userProfile={user} />
      <NewsCards />
    </div>
  );
}

// TODO: Remove Logout Button Component
