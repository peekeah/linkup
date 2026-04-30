"use client";

import { Separator } from "@/components/ui/separator";
import Sidebar from "./sidebar";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useHandleMessage from "@/hooks/useHandleMessage";
import useSendMessage from "@/hooks/useSendMessage";
import { SupportedOutgoingUserMessages } from "@/@types/user";
import { SupportedOutgoingCommunityMessages } from "@/@types/community";
import { AuthContext } from "@/store/auth";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { IconMenu2 } from "@tabler/icons-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { wsRef, reconnectEnabledRef, updateConnection } =
    useContext(AuthContext);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryRef = useRef(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        console.warn("WebSocket connection skipped: No token available");
        return;
      }

      // Validate token format (basic validation)
      if (token.length < 10) {
        console.error("WebSocket connection skipped: Invalid token format");
        return;
      }

      const socket = new WebSocket(`${uri}?token=${token}`);
      updateConnection(socket);

      socket.onopen = () => {
        console.log("WebSocket connected successfully");
        retryRef.current = 0;
        try {
          sendMessage({
            type: SupportedOutgoingUserMessages.ChatHistory
          });
          sendMessage({
            type: SupportedOutgoingUserMessages.GetPrivateChatHistory,
            payload: null
          });
          sendMessage({
            type: SupportedOutgoingCommunityMessages.GetCommunities
          });
        } catch (error) {
          console.error("Failed to send initial messages:", error);
        }
      };

      socket.onmessage = (event) => {
        try {
          handleMessage(event.data);
        } catch (error) {
          console.error("Error handling WebSocket message:", error, event.data);
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        // Log additional error details if available
        if (socket.readyState === WebSocket.CLOSED) {
          console.warn("WebSocket connection closed unexpectedly");
        }
      };

      socket.onclose = (event) => {
        console.log("WebSocket closed:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        
        updateConnection(null);
        if (!reconnectEnabledRef.current) {
          console.log("WebSocket reconnection disabled");
          return;
        }

        // Don't reconnect if it was a clean close (user logout, etc.)
        if (event.wasClean) {
          console.log("WebSocket closed cleanly, not reconnecting");
          return;
        }

        const maxRetries = 5;
        if (retryRef.current >= maxRetries) {
          console.error(`WebSocket reconnection failed after ${maxRetries} attempts`);
          return;
        }

        const delay = Math.min(2 ** retryRef.current, 16) * 1000;
        console.log(`Attempting WebSocket reconnection ${retryRef.current + 1}/${maxRetries} in ${delay}ms`);
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
    <main className="h-screen w-screen flex flex-col font-serif">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <div className="text-xl font-bold font-serif">
          <span className="text-primary">Lu</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <IconMenu2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex h-full w-full overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full w-full bg-background z-50 md:hidden">
              <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
            </div>
          </>
        )}
        
        <Separator orientation="vertical" className="hidden md:block" />
        <div className="h-full w-full min-h-0 overflow-hidden">{children}</div>
      </div>
    </main>
  );
}
