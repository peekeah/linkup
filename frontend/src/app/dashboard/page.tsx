"use client";
import { useContext, useEffect, useState } from "react";

import { Separator } from "@/components/ui/separator";
import ChatPanel from "./ChatPanel";
import ListPanel from "./ListPanel";
import Sidebar from "./sidebar";
import Topbar from "./Topbar";
import ProfileDetails from "./ProfileDetails";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import useHandleMessage from "@/hooks/useHandleMessage";
import { ChatContext } from "@/store/chat";
import { AuthContext } from "@/store/auth";
import useSendMessage from "@/hooks/useSendMessage";
import { SupportedChatMessages } from "@/@types/chat";
import { SupportedOutgoingUserMessages } from "@/@types/user";

export interface MemberDetails {
  name: string;
  title: string;
  bio: string;
}

type ProfileDrawer = {
  open: false;
  data: null
} | {
  open: true,
  data: MemberDetails
}

const Dashboard = () => {

  const { state: authState, updateConnection } = useContext(AuthContext)
  // const ws = useRef<null | WebSocket>(null);
  const ws = authState?.ws;

  const router = useRouter();
  const { handleMessage } = useHandleMessage();
  const sendMessage = useSendMessage();

  const { state } = useContext(ChatContext);
  const { selectedChat } = state;

  const [profileDrawer, setProfileDrawer] = useState<ProfileDrawer>({
    open: false,
    data: null
  })

  const toggleDrawer = () => {
    setProfileDrawer(prev => {
      if (prev.open) {
        return ({
          open: false,
          data: null
        })
      } else {
        return ({
          open: true,
          data: {
            name: "Alex F",
            title: "Full stack Developer",
            bio: `An enthustiac web developer,
            Expert in React, Express, MongoDB & TailwindCSS`
          }
        })
      }
    })
  }

  useEffect(() => {
    if (selectedChat && selectedChat?.communityId) {
      try {
        sendMessage({
          type: SupportedChatMessages.GetChat,
          payload: {
            roomId: selectedChat.communityId
          }
        })
      } catch (err) {
        console.log("error while parsing json", err)
      }
    }
  }, [selectedChat])

  useEffect(() => {
    try {
      const uri = process.env.NEXT_PUBLIC_WS_HOST || "ws://localhost:5000";
      const token = getToken();

      // #Todo: Logout and clear token
      if (!token) {
        return router.push("/");
      }

      if (ws) {
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
      } else {
        updateConnection(new WebSocket(`${uri}?token=${token}`));
      }

      return () => {
        ws?.close();
      }

    } catch (err) {
      console.log("err", err)
    }
  }, [authState?.ws])

  return (
    <div className="!h-screen !w-screen flex flex-col bg-white font-serif">
      <Topbar />
      <Separator />
      <div className="flex !flex-1">
        <Sidebar />
        <Separator orientation="vertical" />
        <div className="w-[450px] h-full"><ListPanel /></div>
        <Separator orientation="vertical" />
        <div className="!flex-1"><ChatPanel toggleDrawer={toggleDrawer} /> </div>
        {
          profileDrawer.open ?
            <>
              <Separator orientation="vertical" />
              <div className="w-3/12">
                <ProfileDetails
                  toggleDrawer={toggleDrawer}
                  memberDetails={profileDrawer.data}
                />
              </div>
            </> : null
        }
      </div>
    </div>
  )
}

export default Dashboard;
