"use client";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";

import ProfilePicture from "@/assets/person-messaging.png";
import { ChangeEvent, KeyboardEvent, useContext, useEffect, useState } from "react";
import ButtonIcon from "@/components/ui/button-icon";
import InfoIcon from "@/assets/info-circle.png";
import SendIcon from "@/assets/send-icon.svg";
import { ChatContext, Message } from "@/store/chat";
import { Input } from "@/components/ui/input";
import { SupportedChatMessages } from "@/@types/chat";
import useSendMessage from "@/hooks/useSendMessage";
import { AuthContext } from "@/store/auth";

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

  const [chatMessages, setChatMessages] = useState<ChatMessages>(new Map());
  const [text, setText] = useState<string>("");

  const { state } = useContext(ChatContext);
  const { state: authState } = useContext(AuthContext);

  const userId = authState?.userId;

  const { selectedChat, messages } = state;
  const sendMessage = useSendMessage();

  useEffect(() => {
    if (selectedChat) {
      const currentMessages = messages?.get(selectedChat?.communityId);
      if (currentMessages?.length) {
        const newMessages = formatMessages(currentMessages);
        setChatMessages(newMessages)
        setText(() => "")
      }
    }
  }, [state])

  const onClick = () => {
    try {
      if (selectedChat?.communityId) {
        sendMessage({
          type: SupportedChatMessages.AddChat,
          payload: {
            roomId: selectedChat?.communityId,
            content: text,
          }
        })
      }

    } catch (err) {
      console.log("error while adding chat", err)
    }
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(() => e.target.value)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e?.key === "Enter") {
      onClick();
    }
  }

  return (
    <div className="p-5 h-full w-full relative">
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
      <div className="!flex-1">
        <div className="flex  justify-center items-center py-5 rounded-xl absolute bottom-0 flex gap-3 w-full">
          <Input
            value={text}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            className="border-primary h-12 !rounded-full max-w-[600px]"
            placeholder="Message"
          />
          <ButtonIcon
            className="rounded-full bg-[#FFECFA] p-3"
            onClick={onClick}
            icon={SendIcon}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatPanel;
