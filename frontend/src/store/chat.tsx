"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface ChatContextType {
  chatHistory: ChatHistory[];
  setChatHistory: Dispatch<SetStateAction<ChatHistory[]>>;
  updateChatHistory: (chatHistory: ChatHistory[]) => void;
}

interface LastMessage {
  content: string;
  date: string;
}

// Note: Add for private message
export interface ChatHistory extends LastMessage {
  communityId: string;
  communityName: string;
}

export const ChatContext = createContext<ChatContextType>({
  chatHistory: [],
  setChatHistory: () => { },
  updateChatHistory: () => { }
});

const Chat = ({ children }: { children: ReactNode }) => {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])

  const updateChatHistory = (chatHistory: ChatHistory[]) => {
    setChatHistory(() => chatHistory)
  }
  return (
    <ChatContext.Provider value={{
      chatHistory, setChatHistory, updateChatHistory
    }}>{children}</ChatContext.Provider>
  )
}

export default Chat;
