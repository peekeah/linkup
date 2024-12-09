"use client";
import { useContext, useEffect, useRef, useState } from "react";

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

  const ws = useRef<null | WebSocket>(null);
  const router = useRouter();
  const { handleMessage } = useHandleMessage();

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

  const sendMessage = (message: string) => {
    try {
      if (ws?.current && ws?.current?.readyState === WebSocket.OPEN) {
        ws.current.send(message)
      }
    } catch (err) {
      console.log("connection is broken", err)
    }
  }

  useEffect(() => {
    if (selectedChat && selectedChat?.communityId) {
      try {
        const req = JSON.stringify({
          type: "GET_CHAT",
          payload: {
            roomId: selectedChat.communityId
          }
        })
        sendMessage(req)
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

      ws.current = new WebSocket(`${uri}?token=${token}`);

      if (!ws || !ws?.current) {
        return
      }

      ws.current.onopen = () => {
        sendMessage(JSON.stringify({
          type: "CHAT_HISTORY",
        }))
      };

      ws.current.onmessage = (event) => {
        handleMessage(event.data)
      }

      ws.current.onerror = (err) => {
        console.log("error", err)
      }

      ws.current.onclose = () => {
        console.log("connection is closed")
      }

      return () => {
        ws.current?.close();
      }

    } catch (err) {
      console.log("err", err)
    }
  }, [])

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
