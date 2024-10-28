import React from "react";
import { getSession } from "@auth0/nextjs-auth0";
import DefaultHome from "../components/DefaultHome";
import NewsApp from "../components/NewsApp";
import { Alex_Brush } from "@next/font/google";

const alexBrush = Alex_Brush({
  weight: "400",
  subsets: ["latin"],
});

export default async function Home() {
  const session = await getSession();
  const user = session?.user || null;

  return (
    <div className="h-full w-full rounded-md flex items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {user ? <NewsApp user={user} /> : <DefaultHome titleFont={alexBrush} />}
    </div>
  );
}
