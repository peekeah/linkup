"use client";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { Pencil, Trash2 as Trash, ArrowBigUp as ArrowUp, ArrowBigDown as ArrowDown } from "lucide-react";

import ProfilePicture from "@/assets/person-messaging.png";
import { ChangeEvent, ChangeEventHandler, KeyboardEvent, useContext, useEffect, useState } from "react";
import ButtonIcon from "@/components/ui/button-icon";
import InfoIcon from "@/assets/info-circle";
import SendIcon from "@/assets/send-icon";
import { ChatContext, Message } from "@/store/chat";
import { Input } from "@/components/ui/input";
import { SupportedChatMessages } from "@/@types/chat";
import useSendMessage from "@/hooks/useSendMessage";
import { AuthContext } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import InputAlert from "./InputAlert";
import { Separator } from "@/components/ui/separator";
import { getDate } from "@/lib/utils";

type ChatMessages = Map<Date, Message[]>;

const formatMessages = (message: Message[]) => {
  return message.reduce((acc, entry) => {
    const dateKey = entry.date.split("T")[0];

    if (acc.has(dateKey)) {
      acc.set(dateKey, [...acc.get(dateKey), entry])
    } else {
      acc.set(dateKey, [entry])
    }
    return acc;
  }, new Map());
}

const isUpvoted = (upvotes: string[], userId: string) => {
  return Boolean(upvotes?.length && upvotes.includes(userId))
}

const ChatPanel = ({ toggleDrawer }: { toggleDrawer: () => void }) => {

  const [chatMessages, setChatMessages] = useState<ChatMessages>(new Map());
  const [text, setText] = useState<string>("");

  const [newMessage, setNewMessage] = useState("");

  const { state } = useContext(ChatContext);
  const { state: authState } = useContext(AuthContext);

  const userId = authState?.userId;

  const { selectedChat, messages } = state;
  const sendMessage = useSendMessage();

  const { toast } = useToast();

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

  const onModalClose = () => {
    setNewMessage("")
  }

  const onMessageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNewMessage(e.target.value)
  }

  const onEditMessage = (chatId: string) => {
    try {
      if (selectedChat?.communityId && newMessage) {
        sendMessage({
          type: SupportedChatMessages.UpdateChat,
          payload: {
            roomId: selectedChat?.communityId,
            chatId,
            content: newMessage
          }
        })
        toast({
          title: "Message",
          description: "Successfully updated message"
        })
      }
      setNewMessage("")
    } catch (err) {
      console.log("error while editing message", err)
    }
  }

  const handleDeleteMessage = (communityId: string, chatId: string) => {
    try {
      sendMessage({
        type: SupportedChatMessages.DeleteChat,
        payload: {
          roomId: communityId,
          chatId
        }
      })
      toast({
        title: "Message",
        description: "Successfully deleted message"
      })
    } catch (err) {
      console.log("error while editing message", err)
    }
  }

  const handleUpvoteMessage = (chatId: string) => {
    try {
      if (selectedChat?.communityId) {
        sendMessage({
          type: SupportedChatMessages.UpvoteMessage,
          payload: {
            roomId: selectedChat.communityId,
            chatId
          }
        })
      }
    } catch (err) {
      console.log("error while editing message", err)
    }
  }

  return (
    <div className="h-full relative">
      {/* Chat header */}
      <div className="p-5 flex w-full gap-3 items-center">
        <Avatar className="shadow-md p-3">
          <Image src={ProfilePicture} alt="Profile pic" />
          {/* <AvatarFallback>{item.name}</AvatarFallback> */}
        </Avatar>
        <div className="w-full">
          <div className="flex items-center gap-3">
            <div className="text-heading">{selectedChat?.communityName}</div>
            <ButtonIcon
              noBorder
              onClick={toggleDrawer}
              icon={InfoIcon}
              className="!h-10 !w-10 !p-1.5 rounded-md"
            />
          </div>
        </div>
      </div>

      <Separator orientation="horizontal" />
      {/* Chat body */}
      <div className="m-5 space-y-10 overflow-y-auto">
        {
          Array.from(chatMessages.entries()).map(([date, messages]) => (
            <div key={date?.toString()}>
              <div className="text-center">{getDate(messages[0]?.date, true)}</div>
              <div className="gap-3 flex flex-col">
                {
                  messages.map(message => (
                    <div key={message.id} className={`max-w-[700px] space-y-1 !overflow-hidden ${message.sender.userId !== userId ? "text-left bg-[#EAE8E8] rounded-t-xl rounded-br-xl" : "bg-primary text-white rounded-xl rounded-bl-xl self-end"}`}>
                      <div className="p-3">{!message?.isDeleted ? message.content : "This message is deleted"}</div>
                      {
                        !message?.isDeleted && message?.sender.userId === userId ?
                          <div className="flex items-center gap-2 bg-red-300 p-1">
                            <div className="flex items-center gap-1">
                              {
                                !isUpvoted(message.upvotes, userId) ?
                                  <ArrowUp
                                    width={20}
                                    height={20}
                                    className="cursor-pointer transition ease-in-out delay-150"
                                    onClick={() => handleUpvoteMessage(message.id)}
                                  /> :
                                  <ArrowDown
                                    width={20}
                                    height={20}
                                    className="cursor-pointer transition ease-in-out delay-150"
                                    onClick={() => handleUpvoteMessage(message.id)}
                                  />
                              }
                              <div>{message.upvotes?.length}</div>
                            </div>
                            <Trash
                              width={15}
                              height={15}
                              className="cursor-pointer"
                              onClick={() => handleDeleteMessage(selectedChat?.communityId || "", message.id)}
                            />
                            <InputAlert
                              title="Edit message"
                              placeholder="Message"
                              value={newMessage}
                              triggerButton={
                                <Pencil
                                  width={15}
                                  height={15}
                                  className="cursor-pointer"
                                />
                              }
                              onChange={onMessageChange}
                              onSubmit={() => onEditMessage(message.id)}
                              onClose={onModalClose}
                            />
                          </div> : null
                      }
                    </div>
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
            noBorder
            className="rounded-full h-12 w-12"
            onClick={onClick}
            icon={SendIcon}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatPanel;
