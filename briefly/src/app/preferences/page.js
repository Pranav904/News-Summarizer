import { getSession } from '@auth0/nextjs-auth0';
import PreferencesComponent from './components/PreferencesComponent';

export default async function PreferencesPage() {
  // Fetch the session on the server side
  const session = await getSession();

  if (!session?.user) {
    return <div>You must be logged in to view this page.</div>;
  }

  return <PreferencesComponent user={session.user} />;
}