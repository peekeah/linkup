"use client";
import { Suspense, useContext, useEffect, useState } from "react";

import ChatPanel from "./ChatPanel";
import ProfileDetails from "./ProfileDetails";
import { ChatContext } from "@/store/chat";
import useSendMessage from "@/hooks/useSendMessage";
import { SupportedChatMessages } from "@/@types/chat";
import { Separator } from "@/components/ui/separator";
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
  const { state, updateSelectedChat } = useContext(ChatContext);
  const { selectedChat } = state;
  const selectedCommunityId =
    selectedChat && "communityId" in selectedChat ?
      selectedChat?.communityId :
      ""

  const [profileDrawer, setProfileDrawer] = useState<ProfileDrawer>({
    open: false,
    data: null
  })

  // Mobile toggle state for ChatPanel - false shows ListPanel, true shows ChatPanel
  const [toggleChatPanel, setToggleChatPanel] = useState(false);

  const toggleDrawer = () => {
    // #TODO: Future implementation
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
    if (selectedCommunityId) {
      try {
        sendMessage({
          type: SupportedChatMessages.GetChat,
          payload: {
            roomId: selectedCommunityId
          }
        })
      } catch (err) {
        console.log("error while parsing json", err)
      }
    }
  }, [selectedCommunityId, sendMessage])

  const handleSelectChat = (chat: any) => {
    updateSelectedChat(chat);
    setToggleChatPanel(true);
  };

  return (
    <div className="w-full h-full overflow-hidden flex">
      {/* Desktop Layout */}
      <div className="hidden md:flex w-full">
        <Separator orientation="vertical" />
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <ListPanel />
        </Suspense>
        <Separator orientation="vertical" />
        <ChatPanel />
      </div>
      
      {/* Mobile Layout */}
      <div className="md:hidden w-full">
        {!toggleChatPanel ? (
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            <ListPanel
              onSelectChat={handleSelectChat}
              disableHighliteSelected={true}
            />
          </Suspense>
        ) : (
          <ChatPanel onBackToList={() => setToggleChatPanel(false)} />
        )}
      </div>
      
      <>
        {
          profileDrawer.open ?
            <div className="w-3/12 hidden md:block">
              <ProfileDetails
                toggleDrawer={toggleDrawer}
                memberDetails={profileDrawer.data}
              />
            </div>
            : null
        }
      </>
    </div>
  )
}

export default Dashboard;
