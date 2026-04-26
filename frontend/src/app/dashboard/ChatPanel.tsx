"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ChangeEvent, ChangeEventHandler, KeyboardEvent, useContext, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatContext, Message, ChatOrPrivateHistory } from "@/store/chat";
import { Input } from "@/components/ui/input";
import { SupportedChatMessages } from "@/@types/chat";
import useSendMessage from "@/hooks/useSendMessage";
import InputAlert from "./InputAlert";
import { Separator } from "@/components/ui/separator";
import { getDate } from "@/lib/utils";
import { IconArrowBigDown, IconArrowBigUp, IconDots, IconMessage, IconPencil, IconSearch, IconSend, IconTrash, IconUser } from "@tabler/icons-react";
import { toast } from "sonner";
import clsx from "clsx";
import { useSession } from "next-auth/react";

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

const isUpvoted = (upvotes: { id: string }[], userId: string) => {
  for (const el of upvotes) {
    if (el.id === userId) {
      return true;
    }
  }
  return false
}

const ChatPanel = () => {

  const [chatMessages, setChatMessages] = useState<ChatMessages>(new Map());
  const [text, setText] = useState<string>("");
  const [onEditMessageModal, setEditMessageModal] = useState({
    state: false,
    messageContent: "",
    messageId: ""
  });

  const { state } = useContext(ChatContext);

  const session = useSession();
  const userId = session.data?.user.userId ?? "";

  const { selectedChat, messages, privateMessages } = state;

  const currentMessages = useMemo(() => {
    if (!selectedChat) return [];
    
    if (selectedChat.type === 'private') {
      return privateMessages?.get(selectedChat.recipientId ?? "") ?? [];
    } else {
      return messages?.get(selectedChat.communityId ?? "") ?? [];
    }
  }, [messages, privateMessages, selectedChat]);

  const sendMessage = useSendMessage();

  useEffect(() => {
    if (selectedChat) {
      const newMessages = formatMessages(currentMessages);
      setChatMessages(newMessages)
      setText(() => "")
    }
  }, [currentMessages, selectedChat])

  const onClick = () => {
    try {
      if (!selectedChat) {
        toast("Error", {
          description: "No chat selected"
        });
        return;
      }

      if (!text.trim()) {
        toast("Error", {
          description: "Message cannot be empty"
        });
        return;
      }

      // Validate required IDs
      if ('communityId' in selectedChat) {
        if (!selectedChat.communityId) {
          toast("Error", {
            description: "Community ID is missing"
          });
          return;
        }
        sendMessage({
          type: SupportedChatMessages.AddChat,
          payload: {
            roomId: selectedChat.communityId,
            content: text.trim(),
          }
        });
      } else {
        if (!selectedChat.recipientId) {
          toast("Error", {
            description: "Recipient ID is missing"
          });
          return;
        }
        sendMessage({
          type: SupportedChatMessages.SendPrivateMessage,
          payload: {
            recipientId: selectedChat.recipientId,
            content: text.trim(),
          }
        });
      }
      setText(""); 
    } catch (err) {
      toast("Error", {
        description: "Failed to send message. Please try again."
      });
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
    setEditMessageModal({ state: false, messageContent: "", messageId: "" })
  }

  const onMessageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEditMessageModal(prev => ({ ...prev, messageContent: e.target.value }))
  }

  const onEditMessage = () => {
    try {
      if (selectedChat && onEditMessageModal.messageContent && onEditMessageModal.messageId) {
        const roomId = selectedChat.type === 'community' ? selectedChat.communityId : selectedChat.recipientId;
        sendMessage({
          type: SupportedChatMessages.UpdateChat,
          payload: {
            roomId: roomId,
            chatId: onEditMessageModal.messageId,
            content: onEditMessageModal.messageContent
          }
        })
        toast("Message", {
          description: "Successfully updated message"
        })
      }
      setEditMessageModal({ state: false, messageContent: "", messageId: "" })
    } catch (err) {
      // Error handling without console logging
    }
  }

  const handleDeleteMessage = (roomId: string, chatId: string) => {
    try {
      sendMessage({
        type: SupportedChatMessages.DeleteChat,
        payload: {
          roomId: roomId,
          chatId
        }
      })
      toast("Successfully deleted message")

    } catch (err) {
      // Error handling without console logging
    }
  }

  const handleUpvoteMessage = (chatId: string) => {
    try {
      if (selectedChat) {
        const roomId = selectedChat.type === 'community' ? selectedChat.communityId : selectedChat.recipientId;
        sendMessage({
          type: SupportedChatMessages.UpvoteMessage,
          payload: {
            roomId: roomId,
            chatId
          }
        })
      }
    } catch (err) {
      // Error handling without console logging
    }
  }


  return (
    <div className="h-full flex flex-col">
      {!selectedChat ? (
        <div className="m-auto flex flex-col items-center justify-center h-full text-center space-y-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
            <IconMessage className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">No Chat Selected</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Choose a community or person from the sidebar to start chatting.
            </p>
          </div>
        </div>
      ) : null}
      {/* Chat header */}
      <div className="p-4 flex w-full gap-3 items-center">
        <Avatar className="shadow-md rounded-xl p-3 border border-neutral">
          <AvatarImage>
            <IconUser />
          </AvatarImage>
          <AvatarFallback><IconUser /></AvatarFallback>
        </Avatar>
        <div className="w-full">
          <div className="text-heading">
            {selectedChat?.type === 'community' ? selectedChat.communityName : selectedChat?.recipientName}
          </div>
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
          currentMessages.length === 0 ? (
            <div className="mx-auto opacity-75 self-center">No messages yet, be the first one to send</div>
          ) : (
            Array.from(chatMessages.entries()).map(([date, messages]) => (
              <div key={date?.toString()}>
                <div>
                  <div className="text-center text-xs font-light">{getDate(messages[0]?.createdAt, true)}</div>
                </div>
                <div className="gap-3 flex flex-col">
                  {
                    messages.map(message => (
                      <div key={message.id} className={
                        clsx(
                          `w-fit group space-y-1 overflow-hidden`,
                          message.senderId !== userId ? "text-left bg-secondary rounded-t-xl rounded-br-xl" : "bg-primary text-white rounded-xl rounded-bl-xl self-end"
                        )
                        }>
                        <div className="p-3 relative">{!message?.isDeleted ? message.content : "This message is deleted"}</div>
                        {
                          !message?.isDeleted ?
                            <div className={clsx(
                              `hidden group-hover:flex z-10 absolute w-fit rounded-xl items-center gap-2 bg-secondary p-1`,
                              message.senderId === userId ? "right-0" : "left-0"
                            )}
                            >
                              <div className="flex items-center">
                                {
                                  selectedChat?.type === 'community' && (
                                    !isUpvoted(message.upvotes, userId) ?
                                      <IconArrowBigUp
                                        className="text-primary size-5 cursor-pointer transition ease-in-out delay-150"
                                        onClick={() => handleUpvoteMessage(message.id)}
                                      /> :
                                      <IconArrowBigDown
                                        className="text-primary size-5 cursor-pointer transition ease-in-out delay-150"
                                        onClick={() => handleUpvoteMessage(message.id)}
                                      />
                                  )
                                }
                                {selectedChat?.type === 'community' && <div>{message.upvotes?.length}</div>}
                              </div>
                              {message.senderId === userId && (
                                <>
                                  <IconTrash
                                    className="text-primary size-5 cursor-pointer"
                                    onClick={() => {
                                      const roomId = selectedChat?.type === 'community' ? selectedChat.communityId : selectedChat?.recipientId;
                                      handleDeleteMessage(roomId || "", message.id)
                                    }}
                                  />
                                  <InputAlert
                                    open={onEditMessageModal.state}
                                    title="Edit message"
                                    placeholder="Message"
                                    value={onEditMessageModal.messageContent}
                                    triggerButton={
                                      <IconPencil
                                        onClick={() => setEditMessageModal({ state: true, messageContent: message.content, messageId: message.id })}
                                        className="text-primary size-5 cursor-pointer"
                                      />
                                    }
                                    onChange={onMessageChange}
                                    onSubmit={() => onEditMessage()}
                                    onClose={onModalClose}
                                  />
                                </>
                              )}
                            </div> : null
                        }
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          )
        }
        <div className="w-full">
          <div className="relative">
            <Input
              value={text}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              disabled={!selectedChat}
              className="w-full h-14 rounded-lg!"
              placeholder={selectedChat ? `Message ${selectedChat.type !== 'private' ? selectedChat.communityName : selectedChat.recipientName}` : undefined}
            />
            <Button size={"icon"} className="absolute right-3.5 inset-y-1/2 transform -translate-y-1/2 rounded-xl" onClick={onClick} disabled={!selectedChat}>
              <IconSend className="text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPanel;
