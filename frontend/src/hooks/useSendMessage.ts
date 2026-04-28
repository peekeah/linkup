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
      
      if (!ws) {
        return;
      }

      if (ws.readyState === WebSocket.CONNECTING) {
        return;
      }

      if (ws.readyState === WebSocket.CLOSING) {
        return;
      }

      if (ws.readyState === WebSocket.CLOSED) {
        return;
      }

      if (ws.readyState !== WebSocket.OPEN) {
        return;
      }

      switch (message.type) {
          // Chat messages
          case SupportedChatMessages.AddChat:
            ws.send(JSON.stringify({
              type: SupportedChatMessages.AddChat,
              payload: message.payload
            }));
            break;

          case SupportedChatMessages.GetChat:
            ws.send(JSON.stringify({
              type: SupportedChatMessages.GetChat,
              payload: message.payload
            }));
            break;

          case SupportedChatMessages.UpdateChat:
            ws.send(JSON.stringify({
              type: SupportedChatMessages.UpdateChat,
              payload: message.payload
            }));
            break;

          case SupportedChatMessages.DeleteChat:
            ws.send(JSON.stringify({
              type: SupportedChatMessages.DeleteChat,
              payload: message.payload
            }));
            break;
          case SupportedChatMessages.UpvoteMessage:
            ws.send(JSON.stringify({
              type: SupportedChatMessages.UpvoteMessage,
              payload: message.payload
            }));
            break;

          // User messages
          case SupportedOutgoingUserMessages.ChatHistory:
            ws.send(JSON.stringify({
              type: SupportedOutgoingUserMessages.ChatHistory,
            }));
            break;

          case SupportedOutgoingUserMessages.Search:
            ws.send(JSON.stringify({
              type: SupportedOutgoingUserMessages.Search,
              payload: message.payload
            }));
            break;

          case SupportedOutgoingUserMessages.GetPrivateChatHistory:
            ws.send(JSON.stringify({
              type: SupportedOutgoingUserMessages.GetPrivateChatHistory,
              payload: message.payload
            }));
            break;

          case SupportedChatMessages.SendPrivateMessage:
            ws.send(JSON.stringify({
              type: SupportedChatMessages.SendPrivateMessage,
              payload: message.payload
            }));
            break;

          case SupportedChatMessages.GetPrivateChat:
            ws.send(JSON.stringify({
              type: SupportedChatMessages.GetPrivateChat,
              payload: message.payload
            }));
            break;

          case SupportedOutgoingCommunityMessages.JoinCommunity:
            ws.send(JSON.stringify({
              type: SupportedOutgoingCommunityMessages.JoinCommunity,
              payload: message.payload
            }));
            break;

          case SupportedOutgoingCommunityMessages.CreateCommunity:
            ws.send(JSON.stringify({
              type: SupportedOutgoingCommunityMessages.CreateCommunity,
              payload: message.payload
            }));
            break;

          // Community messages
          case SupportedOutgoingCommunityMessages.GetCommunities:
            ws.send(JSON.stringify({
              type: SupportedOutgoingCommunityMessages.GetCommunities,
            }));
            break;
          case SupportedOutgoingCommunityMessages.SearchCommunity:
            ws.send(JSON.stringify({
              type: SupportedOutgoingCommunityMessages.SearchCommunity,
              payload: message.payload
            }))
          case SupportedOutgoingCommunityMessages.LeaveCommunity:
            ws.send(JSON.stringify({
              type: SupportedOutgoingCommunityMessages.LeaveCommunity,
              payload:message.payload
            }))
          default:
        }
    } catch (err) {
    }
  }, [wsRef])
}

export default useSendMessage;
