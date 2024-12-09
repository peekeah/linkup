"use client";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";

import ProfilePicture from "@/assets/person-messaging.png";
import { useContext, useEffect, useState } from "react";
import ButtonIcon from "@/components/ui/button-icon";
import InfoIcon from "@/assets/info-circle.png";
import { ChatContext, Message } from "@/store/chat";

type ChatMessages = Map<Date, Message[]>;

const formatMessages = (message: Message[]) => {
  return message.reduce((acc, entry) => {
    const dateKey = entry.date.split("T")[0];

    const newEntry = {
      ...entry,
      date: dateKey
    }

    if (acc.has(dateKey)) {
      acc.set(dateKey, [...acc.get(dateKey), newEntry])
    } else {
      acc.set(dateKey, [newEntry])
    }
    return acc;
  }, new Map());
}

const ChatPanel = ({ toggleDrawer }: { toggleDrawer: () => void }) => {

  const userId = "user3"; // NOTE: Need to update dynamically
  const [chatMessages, setChatMessages] = useState<ChatMessages>(new Map());

  const { state } = useContext(ChatContext);
  const { selectedChat, messages } = state;

  useEffect(() => {
    if (selectedChat) {
      const currentMessages = messages?.get(selectedChat?.communityId);
      if (currentMessages?.length) {
        const newMessages = formatMessages(currentMessages);
        setChatMessages(newMessages)
      }
    }
  }, [state])

  return (
    <div className="p-5">
      {/* Chat header */}
      <div className="flex gap-3 items-center h-12">
        <Avatar className="shadow-md p-3">
          <Image src={ProfilePicture} alt="Profile pic" />
          {/* <AvatarFallback>{item.name}</AvatarFallback> */}
        </Avatar>
        <div className="w-full">
          <div className="flex items-center gap-3">
            <div className="text-heading">{selectedChat?.communityName}</div>
            <ButtonIcon onClick={toggleDrawer} icon={InfoIcon} />
          </div>
        </div>
      </div>

      {/* Chat body */}
      <div className="space-y-10 overflow-y-auto">
        {
          Array.from(chatMessages.entries()).map(([date, messages]) => (
            <div key={date?.toString()}>
              <div className="text-center">{date?.toString()}</div>
              <div className="gap-3 flex flex-col">
                {
                  messages.map(message => (
                    <div key={message.id} className={`max-w-[700px] ${message.sender.userId !== userId ? "text-left bg-[#EAE8E8] rounded-t-xl rounded-br-xl p-3" : "bg-primary text-white rounded-xl rounded-bl-xl p-3 self-end"}`}>{message.content}</div>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ChatPanel;
