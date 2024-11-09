import { getSession } from "@auth0/nextjs-auth0";
import PreferencesComponent from "./components/PreferencesComponent";
import SidebarComponent from "@/components/SideBar";
import { cn } from "@/lib/utils";

export default async function PreferencesPage() {
  // Fetch the session on the server side
  const session = await getSession();
  const user = session?.user || null;

  if (!session?.user) {
    return <div>You must be logged in to view this page.</div>;
  }

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <SidebarComponent userProfile={user} />
      <div className="h-screen rounded-l-2xl w-full dark:bg-black bg-white dark:bg-grid-white/[0.1] bg-grid-black/[0.1] relative flex items-center justify-center">
        <div className="rounded-l-2xl absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <PreferencesComponent user={session.user} />
      </div>
    </div>
  );
}
