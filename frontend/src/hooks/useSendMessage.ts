import { OutgoingMessage } from "@/@types";
import { SupportedChatMessages } from "@/@types/chat";
import { SupportedOutgoingCommunityMessages } from "@/@types/community";
import { SupportedOutgoingUserMessages } from "@/@types/user";
import { AuthContext } from "@/store/auth";
import { useCallback, useContext } from "react";

const useSendMessage = () => {

  const { wsRef } = useContext(AuthContext);

  const sendMessage = useCallback((message: OutgoingMessage) => {
    try {
      const ws = wsRef.current;
      if (ws && ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message))
      }
    } catch (err) {
      console.log("connection is broken", err)
    }
  }, [wsRef])

  return useCallback((message: OutgoingMessage) => {
    switch (message.type) {
      // Chat messages
      case SupportedChatMessages.AddChat:
        return sendMessage({
          type: SupportedChatMessages.AddChat,
          payload: message.payload
        })

      case SupportedChatMessages.GetChat:
        return sendMessage({
          type: SupportedChatMessages.GetChat,
          payload: message.payload
        })

      case SupportedChatMessages.UpdateChat:
        return sendMessage({
          type: SupportedChatMessages.UpdateChat,
          payload: message.payload
        })

      case SupportedChatMessages.DeleteChat:
        return sendMessage({
          type: SupportedChatMessages.DeleteChat,
          payload: message.payload
        })
      case SupportedChatMessages.UpvoteMessage:
        return sendMessage({
          type: SupportedChatMessages.UpvoteMessage,
          payload: message.payload
        })

      // User messages
      case SupportedOutgoingUserMessages.ChatHistory:
        return sendMessage({
          type: SupportedOutgoingUserMessages.ChatHistory,
        })

      case SupportedOutgoingUserMessages.Search:
        return sendMessage({
          type: SupportedOutgoingUserMessages.Search,
          payload: message.payload
        })

      case SupportedOutgoingCommunityMessages.JoinCommunity:
        return sendMessage({
          type: SupportedOutgoingCommunityMessages.JoinCommunity,
          payload: message.payload
        })

      case SupportedOutgoingCommunityMessages.CreateCommunity:
        return sendMessage({
          type: SupportedOutgoingCommunityMessages.CreateCommunity,
          payload: message.payload
        })

      // Community messages
      case SupportedOutgoingCommunityMessages.GetCommunities:
        return sendMessage({
          type: SupportedOutgoingCommunityMessages.GetCommunities,
        })
      default:
        console.error("error while sending message")
        return null
    }
  }, [sendMessage])
}

export default useSendMessage;
