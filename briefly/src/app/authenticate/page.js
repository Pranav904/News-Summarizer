// `app/page.js` is the UI for the `/` URL

import AuthForm from "./components/AuthForm";

export default function Page() {
  return (
    <div className="h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden flex items-center justify-center">
      <AuthForm />
    </div>
  );
}