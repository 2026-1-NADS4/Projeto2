import React from "react";
import { Sidebar } from "./Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <Sidebar />
      <main className="pl-64 min-h-screen pb-12">
        {children}
      </main>
    </div>
  );
}
