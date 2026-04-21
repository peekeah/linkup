"use client";

import { Separator } from "@/components/ui/separator";
import Sidebar from "./sidebar";
import { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useHandleMessage from "@/hooks/useHandleMessage";
import useSendMessage from "@/hooks/useSendMessage";
import { SupportedOutgoingUserMessages } from "@/@types/user";
import { AuthContext } from "@/store/auth";
import { useSession } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { state: authState, wsRef, reconnectEnabledRef, updateConnection } =
    useContext(AuthContext);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryRef = useRef(0);

  const router = useRouter();
  const { handleMessage } = useHandleMessage();
  const sendMessage = useSendMessage();
  const { data: session } = useSession();
  const token = session?.user?.token || ""

  useEffect(() => {
    const uri = process.env.NEXT_PUBLIC_WS_HOST || "ws://localhost:5000";

    reconnectEnabledRef.current = true;

    const connect = () => {
      if (!reconnectEnabledRef.current) {
        return;
      }

      // Don't connect WebSocket if token is not available
      if (!token) {
        return;
      }

      const socket = new WebSocket(`${uri}?token=${token}`);
      updateConnection(socket);

      socket.onopen = () => {
        retryRef.current = 0;
        sendMessage({
          type: SupportedOutgoingUserMessages.ChatHistory
        });
      };

      socket.onmessage = (event) => {
        handleMessage(event.data);
      };

      socket.onerror = (err) => {
        console.log("error", err);
      };

      socket.onclose = () => {
        updateConnection(null);
        if (!reconnectEnabledRef.current) {
          return;
        }

        const maxRetries = 5;
        if (retryRef.current >= maxRetries) {
          return;
        }

        const delay = Math.min(2 ** retryRef.current, 16) * 1000;
        retryRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      };
    };

    if (!wsRef.current) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [
    session,
    handleMessage,
    reconnectEnabledRef,
    router,
    sendMessage,
    updateConnection,
    wsRef
  ])

  return (
    <main>
      <div className="h-screen w-screen flex flex-col font-serif">
        <Separator orientation="horizontal" />
        <div className="flex flex-1">
          <Sidebar />
          <Separator orientation="vertical" />
          <div className="h-full w-full overflow-auto">{children}</div>
        </div>
      </div>
    </main>
  );
}
