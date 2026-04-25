import { OutgoingMessage } from "@/@types";
import { SupportedChatMessages } from "@/@types/chat";
import { SupportedOutgoingCommunityMessages } from "@/@types/community";
import { SupportedOutgoingUserMessages } from "@/@types/user";
import { AuthContext } from "@/store/auth";
import { useCallback, useContext } from "react";

const useSendMessage = () => {

  const { wsRef } = useContext(AuthContext);

  return useCallback((message: OutgoingMessage) => {
    try {
      const ws = wsRef.current;
      if (ws && ws?.readyState === WebSocket.OPEN) {
        switch (message.type) {
          // Chat messages
          case SupportedChatMessages.AddChat:
            return ws.send(JSON.stringify({
              type: SupportedChatMessages.AddChat,
              payload: message.payload
            }))

          case SupportedChatMessages.GetChat:
            return ws.send(JSON.stringify({
              type: SupportedChatMessages.GetChat,
              payload: message.payload
            }))

          case SupportedChatMessages.UpdateChat:
            return ws.send(JSON.stringify({
              type: SupportedChatMessages.UpdateChat,
              payload: message.payload
            }))

          case SupportedChatMessages.DeleteChat:
            return ws.send(JSON.stringify({
              type: SupportedChatMessages.DeleteChat,
              payload: message.payload
            }))
          case SupportedChatMessages.UpvoteMessage:
            return ws.send(JSON.stringify({
              type: SupportedChatMessages.UpvoteMessage,
              payload: message.payload
            }))

          // User messages
          case SupportedOutgoingUserMessages.ChatHistory:
            return ws.send(JSON.stringify({
              type: SupportedOutgoingUserMessages.ChatHistory,
            }))

          case SupportedOutgoingUserMessages.Search:
            return ws.send(JSON.stringify({
              type: SupportedOutgoingUserMessages.Search,
              payload: message.payload
            }))

          case SupportedOutgoingUserMessages.GetPrivateChatHistory:
            return ws.send(JSON.stringify({
              type: SupportedOutgoingUserMessages.GetPrivateChatHistory,
              payload: message.payload
            }))

          case SupportedChatMessages.SendPrivateMessage:
            return ws.send(JSON.stringify({
              type: SupportedChatMessages.SendPrivateMessage,
              payload: message.payload
            }))

          case SupportedChatMessages.GetPrivateChat:
            return ws.send(JSON.stringify({
              type: SupportedChatMessages.GetPrivateChat,
              payload: message.payload
            }))

          case SupportedOutgoingCommunityMessages.JoinCommunity:
            return ws.send(JSON.stringify({
              type: SupportedOutgoingCommunityMessages.JoinCommunity,
              payload: message.payload
            }))

          case SupportedOutgoingCommunityMessages.CreateCommunity:
            return ws.send(JSON.stringify({
              type: SupportedOutgoingCommunityMessages.CreateCommunity,
              payload: message.payload
            }))

          // Community messages
          case SupportedOutgoingCommunityMessages.GetCommunities:
            return ws.send(JSON.stringify({
              type: SupportedOutgoingCommunityMessages.GetCommunities,
            }))
          default:
            console.error("error while sending message")
            return null
        }
      }
    } catch (err) {
      console.log("connection is broken", err)
    }
  }, [wsRef])
}

export default useSendMessage;
