"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ChangeEvent, ChangeEventHandler, KeyboardEvent, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatContext, Message } from "@/store/chat";
import { Input } from "@/components/ui/input";
import { SupportedChatMessages } from "@/@types/chat";
import useSendMessage from "@/hooks/useSendMessage";
import { AuthContext } from "@/store/auth";
import InputAlert from "./InputAlert";
import { Separator } from "@/components/ui/separator";
import { getDate } from "@/lib/utils";
import { IconArrowBigDown, IconArrowBigUp, IconDots, IconPencil, IconSearch, IconSend, IconTrash, IconUser } from "@tabler/icons-react";
import { toast } from "sonner";

type ChatMessages = Map<Date, Message[]>;

const formatMessages = (message: Message[]) => {
  return message.reduce((acc, entry) => {
    const dateKey = entry.createdAt.split("T")[0];

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

const ChatPanel = () => {

  const [chatMessages, setChatMessages] = useState<ChatMessages>(new Map());
  const [text, setText] = useState<string>("");

  const [newMessage, setNewMessage] = useState("");

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
        toast("Message", {
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
      toast("Successfully deleted message")

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
    <div className="h-full flex flex-col">
      {/* Chat header */}
      <div className="p-4 flex w-full gap-3 items-center">
        <Avatar className="shadow-md rounded-xl p-3 border border-neutral">
          <AvatarImage>
            <IconUser />
          </AvatarImage>
          <AvatarFallback><IconUser /></AvatarFallback>
        </Avatar>
        <div className="w-full">
          <div className="text-heading">{selectedChat?.communityName}</div>
        </div>
        <div className="flex gap-2.5">
          <Button size={"icon"} variant={"outline"}><IconSearch /></Button>
          <Button
            size={"icon"}
            variant={"outline"}
            className="flex items-center justify-center"
          ><IconDots /></Button>
        </div>
      </div>

      <Separator orientation="horizontal" />
      {/* Chat body */}
      <div className="m-5 space-y-10 overflow-y-auto flex-1 flex flex-col justify-end">
        {
          Array.from(chatMessages.entries()).map(([date, messages]) => (
            <div key={date?.toString()}>
              <div>
                <div className="text-center text-xs font-light">{getDate(messages[0]?.createdAt, true)}</div>
              </div>
              <div className="gap-3 flex flex-col">
                {
                  messages.map(message => (
                    <div key={message.id} className={`max-w-[700px] group space-y-1 overflow-hidden! ${message.senderId !== userId ? "text-left bg-secondary rounded-t-xl rounded-br-xl" : "bg-primary text-white rounded-xl rounded-bl-xl self-end"}`}>
                      <div className="p-3 relative">{!message?.isDeleted ? message.content : "This message is deleted"}</div>
                      {
                        !message?.isDeleted && message?.senderId === userId ?
                          <div className="hidden group-hover:flex absolute w-fit rounded-xl items-center gap-2 bg-secondary p-1">
                            <div className="flex items-center">
                              {
                                !isUpvoted(message.upvotes, userId) ?
                                  <IconArrowBigUp
                                    className="text-primary size-5 cursor-pointer transition ease-in-out delay-150"
                                    onClick={() => handleUpvoteMessage(message.id)}
                                  /> :
                                  <IconArrowBigDown
                                    className="text-primary size-5 cursor-pointer transition ease-in-out delay-150"
                                    onClick={() => handleUpvoteMessage(message.id)}
                                  />
                              }
                              <div>{message.upvotes?.length}</div>
                            </div>
                            <IconTrash
                              className="text-primary size-5 cursor-pointer"
                              onClick={() => handleDeleteMessage(selectedChat?.communityId || "", message.id)}
                            />
                            <InputAlert
                              title="Edit message"
                              placeholder="Message"
                              value={newMessage}
                              triggerButton={
                                <IconPencil
                                  className="text-primary size-5 cursor-pointer"
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
        <div className="w-full">
          <div className="relative">
            <Input
              value={text}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              className="w-full h-14 rounded-lg!"
              placeholder={selectedChat?.communityName && `Message ${selectedChat?.communityName}`}
            />
            <Button size={"icon"} className="absolute right-3.5 inset-y-1/2 transform -translate-y-1/2 rounded-xl" onClick={onClick}>
              <IconSend className="text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPanel;
