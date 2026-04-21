"use client";
import { Community } from "@/@types/community";
import { createContext, ReactNode, useState } from "react";

interface ChatContextType {
  state: State;
  updateChatHistory: (chatHistory: ChatHistory[]) => void;
  updateSelectedChat: (chat: ChatHistory) => void;
  updateChatMessages: (communityId: string, newMessages: Message[]) => void;
  updateSingleChatMessage: (communityId: string, messageId: string, newMessage: Message) => void;
  clearChatStore: () => void;
}

interface State {
  chatHistory: ChatHistory[];
  selectedChat: ChatHistory | null;
  messages: Map<string, Message[]>;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  upvotes: { id: string }[],
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LastMessage {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// NOTE: Add for private message
export interface ChatHistory extends LastMessage {
  communityId: string;
  communityName: string;
  date: string;
  community: Community;
  message: string;
}

export const ChatContext = createContext<ChatContextType>({
  state: {
    chatHistory: [],
    selectedChat: null,
    messages: new Map(),
  },
  updateChatHistory: () => { },
  updateSelectedChat: () => { },
  updateSingleChatMessage: () => { },
  updateChatMessages: () => { },
  clearChatStore: () => { },
});

const initialValues = {
  chatHistory: [],
  selectedChat: null,
  messages: new Map(),
}

const Chat = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<State>(initialValues);

  const updateChatHistory = (chatHistory: ChatHistory[]) => {
    setState(prev => ({ ...prev, ["chatHistory"]: chatHistory }))
  }

  const updateSelectedChat = (chat: ChatHistory) => {
    setState(prev => ({ ...prev, ["selectedChat"]: chat }))
  }

  const updateSingleChatMessage = (communityId: string, messageId: string, newMessage: Message) => {
    setState(prev => {
      const communityMessages = prev.messages.get(communityId);

      if (!communityMessages) return prev;

      const idx = communityMessages?.findIndex(el => el.id === messageId);

      if (idx === -1) {
        return prev
      }

      // Create new array with the updated message
      const updatedMessages = [...communityMessages];
      updatedMessages[idx] = newMessage;

      // Create new Map with the updated messages
      const newMessagesMap = new Map(prev.messages);
      newMessagesMap.set(communityId, updatedMessages);

      return ({
        ...prev,
        messages: newMessagesMap
      })
    })
  };

  const updateChatMessages = (communityId: string, newMessages: Message[]) => {
    setState(prev => {
      const newMessagesMap = new Map(prev.messages);
      newMessagesMap.set(communityId, newMessages);

      return ({
        ...prev,
        messages: newMessagesMap
      })
    })
  }

  const clearChatStore = () => {
    setState(() => initialValues)
  }

  return (
    <ChatContext.Provider value={{
      state,
      updateChatHistory,
      updateSelectedChat,
      updateChatMessages,
      updateSingleChatMessage,
      clearChatStore,
    }}>{children}</ChatContext.Provider>
  )
}

export default Chat;
