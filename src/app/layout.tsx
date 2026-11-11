import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { PlayerProvider } from "@/lib/player/PlayerContext";
import { Sidebar } from "@/components/Sidebar";
import { PlayerBar } from "@/components/PlayerBar";

export const metadata: Metadata = {
  title: "SONORA",
  description: "Your personal music environment",
  icons: { apple: "/icon/180" },
  appleWebApp: { capable: true, title: "SONORA", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#07080a",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-dvh overflow-hidden">
        <PlayerProvider>
          <div className="flex h-dvh flex-col">
            <div className="flex min-h-0 flex-1">
              <Sidebar />
              <main className="min-w-0 flex-1 overflow-y-auto p-8">{children}</main>
            </div>
            <PlayerBar />
          </div>
        </PlayerProvider>
      </body>
    </html>
  );
}
