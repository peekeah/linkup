import { GetChat } from "@/@types/chat"

class OutgoingMessages {
  constructor() {

  }
  getChat(communityId: string) {
    sendMe

  }

  addChat() {

  }

  deleteChat() {

  }

  upvoteMessage() {

  }

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
  type: SupportedChatMessages.GetChat,
  payload: message.payload
})
break;
      case SupportedChatMessages.UpvoteMessage:
sendMessage({
  type: SupportedChatMessages.UpvoteMessage,
  payload: message.payload
})
break;
      default:
console.error("wrong message type:", message.type)
    }
}
