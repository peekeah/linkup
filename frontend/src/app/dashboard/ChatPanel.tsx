"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ChangeEvent, ChangeEventHandler, Fragment, KeyboardEvent, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatContext, Message } from "@/store/chat";
import { Input } from "@/components/ui/input";
import { SupportedChatMessages } from "@/@types/chat";
import useSendMessage from "@/hooks/useSendMessage";
import InputAlert from "./InputAlert";
import { Separator } from "@/components/ui/separator";
import { getDate } from "@/lib/utils";
import { IconArrowBigDown, IconArrowBigUp, IconLogout, IconMessage, IconPencil, IconSend, IconTrash, IconUser, IconArrowLeft } from "@tabler/icons-react";
import { toast } from "sonner";
import clsx from "clsx";
import { useSession } from "next-auth/react";

type ChatMessages = Map<Date, Message[]>;

interface ChatPanelProps {
  onBackToList?: () => void;
}

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

const ChatPanel = ({ onBackToList }: ChatPanelProps) => {

  const [chatMessages, setChatMessages] = useState<ChatMessages>(new Map());
  const [text, setText] = useState<string>("");
  const [onEditMessageModal, setEditMessageModal] = useState({
    state: false,
    messageContent: "",
    messageId: ""
  });

  // Message cache per chat ID
  const [messageCache, setMessageCache] = useState<Map<string, Message[]>>(new Map());
  
  // Input text cache per chat ID for mobile/desktop compatibility
  const [inputCache, setInputCache] = useState<Map<string, string>>(new Map());
  const previousChatIdRef = useRef<string | null>(null);
  
  // Refs to prevent effect re-running on every keystroke
  const textRef = useRef(text);
  const inputCacheRef = useRef(inputCache);

  const { state } = useContext(ChatContext);

  const session = useSession();
  const userId = session.data?.user.userId ?? "";

  const { selectedChat, messages, privateMessages } = state;

  // Cache messages when they change
  useEffect(() => {
    if (!selectedChat) return;
    
    const chatId = selectedChat.type === 'private' 
      ? selectedChat.recipientId 
      : selectedChat.communityId;
    
    if (!chatId) return;
    
    const newMessages = selectedChat.type === 'private'
      ? privateMessages?.get(chatId) ?? []
      : messages?.get(chatId) ?? [];
    
    if (newMessages.length > 0) {
      setMessageCache(prev => {
        const cache = new Map(prev);
        cache.set(chatId, newMessages);
        return cache;
      });
    }
  }, [messages, privateMessages, selectedChat]);

  const currentMessages = useMemo(() => {
    if (!selectedChat) return [];
    
    const chatId = selectedChat.type === 'private' 
      ? selectedChat.recipientId 
      : selectedChat.communityId;
    
    if (!chatId) return [];
    
    // Try to get from cache first, then from current state
    const cachedMessages = messageCache.get(chatId);
    const currentMessages = selectedChat.type === 'private'
      ? privateMessages?.get(chatId) ?? []
      : messages?.get(chatId) ?? [];
    
    // Return current messages if available, otherwise cached messages
    return currentMessages.length > 0 ? currentMessages : cachedMessages ?? [];
  }, [messages, privateMessages, selectedChat, messageCache]);

  const sendMessage = useSendMessage();

  const bottomRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);
  const hasInitialScrolled = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isInitialLoad.current = true;
  }, [selectedChat]);

  useEffect(() => {
    if (currentMessages.length > 0) {
      // Use requestAnimationFrame to ensure DOM is rendered
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({
          behavior: 'instant'
        });
        
        // Mark initial scroll as done for page refresh
        if (!hasInitialScrolled.current) {
          hasInitialScrolled.current = true;
        }
      });
    }
    isInitialLoad.current = false;
  }, [currentMessages]);

  // Keep refs in sync with state
  useEffect(() => { textRef.current = text; }, [text]);
  useEffect(() => { inputCacheRef.current = inputCache; }, [inputCache]);

  // Handle chat switching with input preservation
  useEffect(() => {
    if (!selectedChat) return;
    
    const chatId = selectedChat.type === 'private' 
      ? selectedChat.recipientId 
      : selectedChat.communityId;
    
    if (!chatId) return;
    
    // Preserve input across navigation and mobile remounts
    const previousChatId = previousChatIdRef.current;
    
    // Save current input before switching chats
    if (previousChatId && previousChatId !== chatId) {
      setInputCache(prev => {
        const cache = new Map(prev);
        cache.set(previousChatId, textRef.current); // read from ref, not state
        return cache;
      });
    }
    
    // Restore saved input or clear if switching to different chat
    const savedInput = inputCacheRef.current.get(chatId); // read from ref
    if (savedInput !== undefined) {
      setText(savedInput);
    } else if (previousChatId !== chatId) {
      setText(""); // Only clear if actually switching to a different chat
    }
    
    previousChatIdRef.current = chatId;
  }, [selectedChat]); // ← only selectedChat

  // Handle message formatting and scrolling
  useEffect(() => {
    if (!selectedChat) return;
    
    const newMessages = formatMessages(currentMessages);
    setChatMessages(newMessages);
    
    // Multiple scroll attempts to ensure it works on page refresh
    const scrollToBottom = () => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({
          behavior: 'instant'
        });
      }
    };
    
    setTimeout(scrollToBottom, 0);
    setTimeout(scrollToBottom, 50);
    setTimeout(scrollToBottom, 100);
  }, [currentMessages, selectedChat]);

  // Scroll detection for scrollbar visibility
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let isScrolling = false;

    const handleScroll = () => {
      if (!isScrolling) {
        // Add scrolling class when scroll starts
        scrollContainer.classList.add('scrolling');
        scrollContainer.classList.add('recently-scrolled');
        isScrolling = true;
      }
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set timeout to remove classes after scroll ends
      scrollTimeoutRef.current = setTimeout(() => {
        scrollContainer.classList.remove('scrolling');
        scrollContainer.classList.remove('recently-scrolled');
        isScrolling = false;
      }, 1500); // Keep visible for 1.5 seconds after scroll stops
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  
  const onClick = () => {
    try {
      if (!selectedChat) {
        toast("Error", { description: "No chat selected" });
        return;
      }
      if (!text.trim()) {
        toast("Error", { description: "Message cannot be empty" });
        return;
      }
      if ('communityId' in selectedChat) {
        if (!selectedChat.communityId) {
          toast("Error", { description: "Community ID is missing" });
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
          toast("Error", { description: "Recipient ID is missing" });
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
      // Clear the cached input after successful send
      if (selectedChat) {
        const chatId = selectedChat.type === 'private' 
          ? selectedChat.recipientId 
          : selectedChat.communityId;
        
        if (chatId) {
          setInputCache(prev => {
            const cache = new Map(prev);
            cache.set(chatId, "");
            return cache;
          });
        }
      }
    } catch (err) {
      toast("Error", { description: "Failed to send message. Please try again." });
    }
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    // Update cache in real-time for immediate persistence
    if (selectedChat) {
      const chatId = selectedChat.type === 'private' 
        ? selectedChat.recipientId 
        : selectedChat.communityId;
      
      if (chatId) {
        setInputCache(prev => {
          const cache = new Map(prev);
          cache.set(chatId, newText);
          return cache;
        });
      }
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e?.key === "Enter") {
      onClick();
    }
  }

  const onModalClose = () => {
    setEditMessageModal({ state: false, messageContent: "", messageId: "" });
  }

  const onMessageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEditMessageModal(prev => ({ ...prev, messageContent: e.target.value }));
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
        });
        toast("Message", { description: "Successfully updated message" });
      }
      setEditMessageModal({ state: false, messageContent: "", messageId: "" });
    } catch (err) {
      toast("Error", { description: "Failed to update message" });
    }
  }

  const handleDeleteMessage = (roomId: string, chatId: string) => {
    try {
      sendMessage({
        type: SupportedChatMessages.DeleteChat,
        payload: { roomId, chatId }
      });
      toast("Successfully deleted message");
    } catch (err) {
      console.log("error while deleting message", err);
    }
  }

  const handleUpvoteMessage = (chatId: string) => {
    try {
      if (selectedChat && selectedChat.type === 'community') {
        const roomId = selectedChat.communityId;
        sendMessage({
          type: SupportedChatMessages.UpvoteMessage,
          payload: { roomId, chatId }
        });
      }
    } catch (err) {
      console.log("error while upvoting message", err);
    }
  }

  const handleLeaveCommunity = () => {
    try {
      if (!selectedChat || !("communityId" in selectedChat)) {
        toast("Error", { description: "No chat selected" });
        return;
      }
      const roomId = selectedChat?.communityId;
      if (!roomId) {
        toast("Error", { description: "Community ID is missing" });
        return;
      }
      sendMessage({
        type: SupportedChatMessages.LeaveCommunity,
        payload: { roomId }
      });
    } catch (err) {
      toast("Error", { description: "Failed to leave community. Please try again." });
    }
  }

  return (
    <div className="h-full w-full flex flex-col min-h-0">
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
      ) : (
        <div className="flex flex-col h-full w-full overflow-hidden min-h-0">

          {/* Header */}
          <div className="m-4 flex gap-3 items-center shrink-0">
            {/* Mobile Back Button */}
            {onBackToList && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBackToList}
                className="md:hidden"
              >
                <IconArrowLeft className="h-5 w-5" />
              </Button>
            )}
            
            <Avatar className="shadow-md rounded-xl p-3 border border-neutral">
              <AvatarImage>
                <IconUser />
              </AvatarImage>
              <AvatarFallback><IconUser /></AvatarFallback>
            </Avatar>
            <div className="w-full">
              <div className="text-heading">
                {selectedChat?.type === 'private' ? selectedChat?.recipientName : selectedChat?.communityName}
              </div>
            </div>
            <div className="flex gap-2.5">
              {selectedChat?.type !== "private" && (
                <Button
                  size={"icon"}
                  variant={"outline"}
                  className="flex items-center justify-center"
                  onClick={handleLeaveCommunity}
                >
                  <IconLogout />
                </Button>
              )}
            </div>
          </div>

          <Separator orientation="horizontal" />

            {/* Messages — flex-1 takes all remaining height, scrolls inside */}
            <div 
            ref={scrollContainerRef}
            className="chat-scroll flex-1 overflow-y-auto min-h-0 px-5 pb-4 flex flex-col"
            >

              {/* pushes messages to bottom when content is short */}
              <div className="mt-auto" />

            {currentMessages.length === 0 ? (
              <div className="mx-auto opacity-75 self-center py-4">
                No messages yet, be the first one to send
              </div>
            ) : (
              Array.from(chatMessages.entries()).map(([date, messages]) => (
                <Fragment key={date?.toString()}>
                  <div className="my-4">
                    <div className="text-center text-xs font-light">
                      {getDate(messages[0]?.createdAt, true)}
                    </div>
                  </div>
                  <div className="gap-3 flex flex-col">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={clsx(
                          "w-fit group space-y-1",
                          message.senderId !== userId
                            ? "text-left bg-secondary rounded-t-xl rounded-br-xl"
                            : "bg-primary text-white rounded-xl rounded-bl-xl self-end"
                        )}
                      >
                        <div className="p-3 relative">
                          {!message?.isDeleted ? message.content : "This message is deleted"}
                        </div>
                        {!message?.isDeleted ? (
                          <div className={clsx(
                            "hidden group-hover:flex z-10 absolute w-fit rounded-xl items-center gap-2 bg-secondary p-1",
                            message.senderId === userId ? "right-0" : "left-0"
                          )}>
                            <div className="flex items-center">
                              {selectedChat?.type === 'community' && (
                                !isUpvoted(message.upvotes, userId) ? (
                                  <IconArrowBigUp
                                    className="text-primary size-5 cursor-pointer transition ease-in-out delay-150"
                                    onClick={() => handleUpvoteMessage(message.id)}
                                  />
                                ) : (
                                  <IconArrowBigDown
                                    className="text-primary size-5 cursor-pointer transition ease-in-out delay-150"
                                    onClick={() => handleUpvoteMessage(message.id)}
                                  />
                                )
                              )}
                              {selectedChat?.type === 'community' && (
                                <div>{message.upvotes?.length}</div>
                              )}
                            </div>
                            {message.senderId === userId && selectedChat?.type === 'community' && (
                              <>
                                <IconTrash
                                  className="text-primary size-5 cursor-pointer"
                                  onClick={() => {
                                    const roomId = selectedChat?.communityId;
                                    handleDeleteMessage(roomId || "", message.id);
                                  }}
                                />
                                <InputAlert
                                  open={onEditMessageModal.state}
                                  title="Edit message"
                                  placeholder="Message"
                                  value={onEditMessageModal.messageContent}
                                  triggerButton={
                                    <IconPencil
                                      onClick={() => setEditMessageModal({
                                        state: true,
                                        messageContent: message.content,
                                        messageId: message.id
                                      })}
                                      className="text-primary size-5 cursor-pointer"
                                    />
                                  }
                                  onChange={onMessageChange}
                                  onSubmit={() => onEditMessage()}
                                  onClose={onModalClose}
                                />
                              </>
                            )}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </Fragment>
              ))
            )}

              {/* scroll anchor — always at the bottom */}
              <div ref={bottomRef} />

          </div>

          {/* Input — pinned to bottom, never scrolls */}
          <div className="w-full p-5 shrink-0">
            <div className="relative">
              <Input
                value={text}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                disabled={!selectedChat}
                className="w-full h-14 rounded-lg!"
                placeholder={selectedChat
                  ? `Message ${selectedChat.type !== 'private' ? selectedChat.communityName : selectedChat.recipientName}`
                  : undefined
                }
              />
              <Button
                size={"icon"}
                className="absolute right-3.5 inset-y-1/2 transform -translate-y-1/2 rounded-xl"
                onClick={onClick}
                disabled={!selectedChat}
              >
                <IconSend className="text-white" />
              </Button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default ChatPanel;