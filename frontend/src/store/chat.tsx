"use client";
import { Community, Member } from "@/@types/community";
import { UserId } from "@/@types/user";
import { createContext, ReactNode, useState } from "react";

interface ChatContextType {
  state: State;
  updateChatHistory: (chatHistory: ChatHistory[]) => void;
  updateSelectedChat: (chat: ChatHistory) => void;
  updateChatMessages: (communityId: string, newMessages: Message[]) => void;
  updateSearchContent: (content: Community[]) => void;
}

interface State {
  chatHistory: ChatHistory[];
  selectedChat: ChatHistory | null;
  messages: Map<string, Message[]>;
  searchContent: Community[]
}

export interface Message {
  id: string;
  content: string;
  sender: Member;
  upvotes: UserId[],
  // date: Date;
  date: string;
  isDeleted: boolean;
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
  state: {
    chatHistory: [],
    selectedChat: null,
    messages: new Map(),
    searchContent: [],
  },
  updateChatHistory: () => { },
  updateSelectedChat: () => { },
  updateChatMessages: () => { },
  updateSearchContent: () => { },
});


const Chat = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<State>({
    chatHistory: [],
    selectedChat: null,
    messages: new Map(),
    searchContent: [],
  });

  const updateChatHistory = (chatHistory: ChatHistory[]) => {
    setState(prev => ({ ...prev, ["chatHistory"]: chatHistory }))
  }

  const updateSelectedChat = (chat: ChatHistory) => {
    setState(prev => ({ ...prev, ["selectedChat"]: chat }))
  }

  const updateChatMessages = (communityId: string, newMessages: Message[]) => {
    setState(prev => {

      const messagesCopy = prev.messages;
      let communityMessages = messagesCopy.get(communityId);

      communityMessages = newMessages
      messagesCopy.set(communityId, communityMessages);

      return ({
        ...prev,
        messages: messagesCopy
      })
    })

    /*
    // #NOTE: Update while lazy load implementation
    const messagesCopy = prev.messages;

    let communityMessages = messagesCopy.get(communityId);

    if (communityMessages) {
      communityMessages = [...newMessages, ...communityMessages];
    } else {
      communityMessages = newMessages
    }
    messagesCopy.set(communityId, communityMessages);
    return ({
      ...prev,
      messages: messagesCopy
    })
  })
  */
  }

  const updateSearchContent = (content: Community[]) => {
    setState(prev => {
      return ({
        ...prev,
        searchContent: content
      })
    })
  }

  return (
    <ChatContext.Provider value={{
      state,
      updateChatHistory,
      updateSelectedChat,
      updateChatMessages,
      updateSearchContent,
    }}>{children}</ChatContext.Provider>
  )
}

export default Chat;
