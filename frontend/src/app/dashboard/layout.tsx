"use client";

import { Separator } from "@/components/ui/separator";
import Sidebar from "./sidebar";
import { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useHandleMessage from "@/hooks/useHandleMessage";
import useSendMessage from "@/hooks/useSendMessage";
import { SupportedOutgoingUserMessages } from "@/@types/user";
import { AuthContext } from "@/store/auth";
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token: string): boolean => {
  try {
    const decodedPayload = jwtDecode<{
      exp?: number;
    }>(token);
    if (!decodedPayload.exp) {
      return true;
    }
    return decodedPayload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

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

  useEffect(() => {
    const uri = process.env.NEXT_PUBLIC_WS_HOST || "ws://localhost:5000";
    const token = authState?.token;

    if (!token || isTokenExpired(token)) {
      router.push("/");
      return;
    }

    reconnectEnabledRef.current = true;

    const connect = () => {
      if (!reconnectEnabledRef.current) {
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
    authState?.token,
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
