import { useContext } from "react";

import { SupportedIncomingUserMessages } from "@/@types/user";
import { IncomingMessage } from "@/@types";
import { ChatContext, ChatHistory } from "@/store/chat";

interface RawMessage {
  type: string;
  data: string;
}

const useHandleMessage = () => {

  const { updateChatHistory, setChatHistory } = useContext(ChatContext);

  const handleMessage = async (rawMessage: string) => {
    try {
      const parsedRawMessage: RawMessage = JSON.parse(rawMessage);
      const parsedData = JSON.parse(parsedRawMessage.data)

      const message = {
        type: parsedRawMessage.type,
        data: parsedData,
      } as IncomingMessage;

      console.log("received message:", message)

      switch (message.type) {
        // Incoming user messages
        case SupportedIncomingUserMessages.ChatHistory:
          const chatHistory = message.data as ChatHistory[];
          updateChatHistory(chatHistory)
          setChatHistory(() => chatHistory)
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
