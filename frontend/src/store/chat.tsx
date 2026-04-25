"use client";
import { Community } from "@/@types/community";
import { createContext, ReactNode, useState } from "react";

interface ChatContextType {
  state: State;
  updateChatHistory: (chatHistory: ChatOrPrivateHistory[]) => void;
  updateSelectedChat: (chat: ChatOrPrivateHistory) => void;
  updateChatMessages: (roomId: string, newMessages: Message[]) => void;
  updatePrivateMessages: (roomId: string, newMessages: Message[]) => void;
  updatePrivateChats: (privateChats: PrivateChatHistory[]) => void;
  updateSingleChatMessage: (roomId: string, messageId: string, newMessage: Message) => void;
  updateSearchResults: (users: User[]) => void;
  clearChatStore: () => void;
}

interface State {
  chatHistory: ChatOrPrivateHistory[];
  selectedChat: ChatOrPrivateHistory | null;
  privateChats: PrivateChatHistory[];
  messages: Map<string, Message[]>;
  privateMessages: Map<string, Message[]>;
  searchResults: User[];
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

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  image?: string;
}

export interface ChatHistory extends LastMessage {
  communityId: string;
  communityName: string;
  date: string;
  community: Community;
  message: string;
  type: 'community';
}

export interface PrivateChatHistory extends LastMessage {
  recipientId: string;
  recipientName: string;
  date: string;
  recipient: User;
  message: string;
  type: 'private';
}

export type ChatOrPrivateHistory = ChatHistory | PrivateChatHistory;

export const ChatContext = createContext<ChatContextType>({
  state: {
    chatHistory: [],
    selectedChat: null,
    privateChats: [],
    messages: new Map(),
    privateMessages: new Map(),
    searchResults: [],
  },
  updateChatHistory: () => { },
  updateSelectedChat: () => { },
  updateSingleChatMessage: () => { },
  updateChatMessages: () => { },
  updatePrivateMessages: () => { },
  updatePrivateChats: () => { },
  updateSearchResults: () => { },
  clearChatStore: () => { },
});

const initialValues = {
  chatHistory: [],
  selectedChat: null,
  privateChats: [],
  messages: new Map(),
  privateMessages: new Map(),
  searchResults: [],
}

const Chat = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<State>(initialValues);

  const updateChatHistory = (chatHistory: ChatOrPrivateHistory[]) => {
    setState(prev => ({ ...prev, ["chatHistory"]: chatHistory }))
  }

  const updateSelectedChat = (chat: ChatOrPrivateHistory) => {
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

  const updateChatMessages = (roomId: string, newMessages: Message[]) => {
    setState(prev => {
      const newMessagesMap = new Map(prev.messages);
      newMessagesMap.set(roomId, newMessages);

      return ({
        ...prev,
        messages: newMessagesMap
      })
    })
  }

  const updatePrivateMessages = (roomId: string, newMessages: Message[]) => {
    setState(prev => {
      const newMessagesMap = new Map(prev.privateMessages);
      newMessagesMap.set(roomId, newMessages);

      return ({
        ...prev,
        privateMessages: newMessagesMap
      })
    })
  }

  const updatePrivateChats = (privateChats: PrivateChatHistory[]) => {
    setState(prev => ({ ...prev, privateChats }))
  }

  const updateSearchResults = (users: User[]) => {
    setState(prev => ({ ...prev, searchResults: users }))
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
      updatePrivateMessages,
      updatePrivateChats,
      updateSingleChatMessage,
      updateSearchResults,
      clearChatStore,
    }}>{children}</ChatContext.Provider>
  )
}

export default Chat;
