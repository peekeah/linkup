import { useContext } from "react";

import { SupportedIncomingUserMessages } from "@/@types/user";
import { IncomingMessage } from "@/@types";
import { ChatContext, ChatHistory } from "@/store/chat";
import { SupportedIncomingChatMessages } from "@/@types/chat";
import { SupportedIncomingCommunityMessage } from "@/@types/community";

const useHandleMessage = () => {

  const { updateChatHistory, updateChatMessages, updateSearchContent } = useContext(ChatContext);

  const handleMessage = async (rawMessage: string) => {
    try {
      const message = JSON.parse(rawMessage) as IncomingMessage;
      console.log("received message:", message)

      let roomId = "";
      let messages = [];

      switch (message.type) {
        // Incoming user messages
        case SupportedIncomingUserMessages.ChatHistory:
          const chatHistory = message.data as ChatHistory[];
          updateChatHistory(chatHistory)
          break;
        case SupportedIncomingChatMessages.GetChat:
          messages = message.data?.messages;
          roomId = message?.data?.roomId;
          updateChatMessages(roomId, messages)
          break;
        case SupportedIncomingCommunityMessage.BrodcastMessages:
          roomId = message.data?.roomId;
          messages = message?.data?.messages;
          updateChatMessages(roomId, messages)
          break;
        case SupportedIncomingCommunityMessage.BroadcastUpvote:
          break;

        case SupportedIncomingUserMessages.Search:
          updateSearchContent(message?.data)
          break;

        default:
          console.log("unsupported message:", message)
      }

    } catch (err) {
      console.log("err while parsing response", err)
    }
  }

  return { handleMessage };

}

export default useHandleMessage;
