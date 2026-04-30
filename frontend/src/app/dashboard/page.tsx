"use client";
import { Suspense, useContext, useEffect, useState } from "react";

import ChatPanel from "./ChatPanel";
import { ChatContext, ChatOrPrivateHistory } from "@/store/chat";
import useSendMessage from "@/hooks/useSendMessage";
import { SupportedChatMessages } from "@/@types/chat";
import { Separator } from "@/components/ui/separator";
import ListPanel from "./ListPanel";

export interface MemberDetails {
  name: string;
  title: string;
  bio: string;
}


const Dashboard = () => {

  const sendMessage = useSendMessage();
  const { state, updateSelectedChat } = useContext(ChatContext);
  const { selectedChat } = state;
  const selectedCommunityId =
    selectedChat && "communityId" in selectedChat ?
      selectedChat?.communityId :
      ""


  // Mobile toggle state for ChatPanel - false shows ListPanel, true shows ChatPanel
  const [toggleChatPanel, setToggleChatPanel] = useState(false);

  
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

  const handleSelectChat = (chat: ChatOrPrivateHistory) => {
    try {
      updateSelectedChat(chat);
      setToggleChatPanel(true);
    } catch (error) {
      console.error("Failed to select chat:", error);
      // Don't set toggleChatPanel if selection failed
    }
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
      
    </div>
  )
}

export default Dashboard;
