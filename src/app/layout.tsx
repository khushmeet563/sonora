import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { PlayerProvider } from "@/lib/player/PlayerContext";
import { Sidebar } from "@/components/Sidebar";
import { PlayerBar } from "@/components/PlayerBar";

export const metadata: Metadata = {
  title: "SONORA",
  description: "Your personal music environment",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden">
        <PlayerProvider>
          <div className="flex h-screen flex-col">
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
