import { OutgoingMessage } from "@/@types";
import { SupportedChatMessages } from "@/@types/chat";
import { SupportedCommunityMessages } from "@/@types/community";
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
        sendMessage({
          type: SupportedChatMessages.AddChat,
          payload: message.payload
        })
        break;

      case SupportedChatMessages.GetChat:
        sendMessage({
          type: SupportedChatMessages.GetChat,
          payload: message.payload
        })
        break;

      case SupportedChatMessages.DeleteChat:
        sendMessage({
          type: SupportedChatMessages.DeleteChat,
          payload: message.payload
        })
        break;
      case SupportedChatMessages.UpvoteMessage:
        sendMessage({
          type: SupportedChatMessages.UpvoteMessage,
          payload: message.payload
        })
        break;

      // User messages
      case SupportedOutgoingUserMessages.ChatHistory:
        sendMessage({
          type: SupportedOutgoingUserMessages.ChatHistory,
        })
        break;

      // Community messages

      default:
        console.error("error while sending message")
    }
  }
}

export default useSendMessage;
