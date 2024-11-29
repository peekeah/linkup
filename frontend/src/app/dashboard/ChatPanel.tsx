"use client";

import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";

import ProfilePicture from "@/assets/person-messaging.png";
import { useEffect, useState } from "react";
import { chatMessagesMock } from "@/mock";

interface Member {
  userId: string;
  name: string;
}
interface Message {
  id: string;
  content: string;
  sender: Member;
  upvotes: string[],
  date: string;
  isDeleted: boolean;
}

type ChatMessages = Map<Date, Message[]>;

const ChatPanel = () => {

  const userId = "user3"; // NOTE: Need to update dynamically
  const [chatMessages, setChatMessages] = useState<ChatMessages>(new Map());

  useEffect(() => {
    const newChats = chatMessagesMock.reduce((acc, entry) => {
      const dateKey = entry.date.toISOString().split("T")[0];

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

    setChatMessages(() => newChats)
  }, []);

  return (
    <div className="p-5">
      {/* Chat header */}
      <div className="flex gap-3 items-center h-12">
        <Avatar className="shadow-md p-3">
          <Image src={ProfilePicture} alt="Profile pic" />
          {/* <AvatarFallback>{item.name}</AvatarFallback> */}
        </Avatar>
        <div className="w-full">
          <div className="flex justify-between">
            <div className="text-heading">{"User name"}</div>
            {/* <ButtonIcon icon={ProfilePicture} /> */}
          </div>
        </div>
      </div>

      {/* Chat body */}
      <div className="space-y-10 overflow-y-scroll">
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
