import type { Metadata } from "next";
import "./globals.css";
import Auth from "@/store/auth";
import Chat from "@/store/chat";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={"flex flex-col h-screen w-full"}
      >
        <Auth>
          <Chat>
            <main>{children}</main>
            <Toaster />
          </Chat>
        </Auth>
      </body>
    </html>
  );
}
