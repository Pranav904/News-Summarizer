import { getSession } from "@auth0/nextjs-auth0";
import PreferencesComponent from "./components/PreferencesComponent";

export default async function PreferencesPage() {
  // Fetch the session on the server side
  const session = await getSession();

  if (!session?.user) {
    return <div>You must be logged in to view this page.</div>;
  }

  return (
    <div className="h-screen w-full rounded-md flex items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <PreferencesComponent user={session.user} />
    </div>
  );
}
