"use client";

import { Separator } from "@/components/ui/separator";
import Topbar from "./Topbar";
import Sidebar from "./sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <main>

      <div className="!h-screen !w-screen flex flex-col bg-white font-serif">
        <Topbar />
        <Separator orientation="horizontal" />
        <div className="flex !flex-1">
          <Sidebar />
          <Separator orientation="vertical" />
          <div className="w-full h-full">{children}</div>
        </div>
      </div>
    </main>
  );
}
