import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ThemeProvider } from 'next-themes';
import { Alex_Brush } from "next/font/google";
import "./globals.css";

import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

const alexBrush = Alex_Brush({
  weight: "400",
  variable: "--font-alex-brush",
  subsets: ["latin"],
});

export const metadata = {
  title: "Briefly",
  description: "TODO !",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${alexBrush.variable} antialiased`}
      >
        <UserProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <SpeedInsights />
            <Analytics />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}