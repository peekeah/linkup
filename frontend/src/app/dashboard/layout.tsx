"use client";

import { Separator } from "@/components/ui/separator";
import Topbar from "./Topbar";
import Sidebar from "./sidebar";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import useHandleMessage from "@/hooks/useHandleMessage";
import useSendMessage from "@/hooks/useSendMessage";
import { SupportedOutgoingUserMessages } from "@/@types/user";
import { AuthContext } from "@/store/auth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { state: authState, updateConnection } = useContext(AuthContext)
  const ws = authState?.ws;

  const router = useRouter();
  const { handleMessage } = useHandleMessage();
  const sendMessage = useSendMessage();

  useEffect(() => {
    try {
      const uri = process.env.NEXT_PUBLIC_WS_HOST || "ws://localhost:5000";
      const token = authState?.token;

      // #Todo: Logout and clear token
      if (!token) {
        return router.push("/");
      }

      if (!ws) {
        return updateConnection(new WebSocket(`${uri}?token=${token}`));
      }


      ws.onopen = () => {
        console.log("open")
        sendMessage({
          type: SupportedOutgoingUserMessages.ChatHistory
        })

        ws.onmessage = (event) => {
          handleMessage(event.data)
        }

        ws.onerror = (err) => {
          console.log("error", err)
        }

        ws.onclose = () => {
          console.log("connection is closed")
        }
      }

      return () => {
        console.log("closing the connection!")
        ws?.close();
        // updateConnection(null)
      }

    } catch (err) {
      console.log("err", err)
    }
  }, [authState?.ws])

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
