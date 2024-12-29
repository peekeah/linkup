"use client";
import { useContext, useEffect, useState } from "react";

import { Separator } from "@/components/ui/separator";
import ChatPanel from "./ChatPanel";
import ProfileDetails from "./ProfileDetails";
import { ChatContext } from "@/store/chat";
import useSendMessage from "@/hooks/useSendMessage";
import { SupportedChatMessages } from "@/@types/chat";
import ListPanel from "./ListPanel";

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

  const sendMessage = useSendMessage();
  const { state } = useContext(ChatContext);
  const { selectedChat } = state;

  const [profileDrawer, setProfileDrawer] = useState<ProfileDrawer>({
    open: false,
    data: null
  })

  const toggleDrawer = () => {
    // #TODO: Need to update while implementation
    return;
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

  return (
    <div className="flex h-full">
      <ListPanel />
      <Separator orientation="vertical" />
      <div className="flex-1">
        <ChatPanel toggleDrawer={toggleDrawer} />
      </div >
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
  )
}

export default Dashboard;
