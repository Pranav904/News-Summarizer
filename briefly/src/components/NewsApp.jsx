'use client';

import SidebarComponent from "./SideBar";
import NewsCards from "./NewsCards";
import { cn } from "@/app/lib/utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewsApp({ user }) {

  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/preferences');
        const data = await response.json();

        if (data?.preferences?.length > 0) {
          setSelectedTags(data.preferences);
        } else {
          router.push("/preferences");
        }
      } catch (err) {
        setError("Failed to fetch preferences");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchPreferences();
  }, [user]);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <SidebarComponent userProfile={user}/>
      <NewsCards userProfile={user}/>
    </div>
  );
}

// TODO: Remove Logout Button Component
// TODO: Remove Preferences Prop, it will be fetched from the API