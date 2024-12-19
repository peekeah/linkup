import { OutgoingMessage } from "@/@types";
import { SupportedChatMessages } from "@/@types/chat";
import { SupportedOutgoingUserMessages } from "@/@types/user";
import { AuthContext } from "@/store/auth";
import { useContext } from "react";

const useSendMessage = () => {

  const { state } = useContext(AuthContext);
  const { ws } = state;

  const sendMessage = (message: OutgoingMessage) => {
    try {
      if (ws && ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message))
      }
    } catch (err) {
      console.log("connection is broken", err)
    }
  }

  return (message: OutgoingMessage) => {
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

      // Community messages
      default:
        console.error("error while sending message")
        return null
    }
  }
}

export default useSendMessage;
