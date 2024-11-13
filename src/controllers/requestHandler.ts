import { WebSocket } from "ws"
import { IncomingMessage, SupportedChatMessages } from "../schema/chat"
import chat from "./chat"
import { SupportedCommunityMessages } from "../schema/community";
import communities from "./communities";

const requestHandler = (message: IncomingMessage, ws: WebSocket) => {
  try {
    // Chat routes
    const { type, payload } = message;

    switch (type) {
      case SupportedChatMessages.AddChat:
        chat.addChat(payload.roomId, payload.content, payload.sender)
        /*
        const response = {
          status: "success",
          message: "Message added successfully"
        }
        ws.send(JSON.stringify(response))
        */
        break;
      case SupportedChatMessages.DeleteChat:
        chat.deleteChat(payload.roomId, payload.chatId);
        break;

      case SupportedChatMessages.UpvoteMessage:
        chat.upvote(payload.userId, payload.roomId, payload.chatId);
        break;

      case SupportedChatMessages.DownvoteMessage:
        chat.downvote(payload.userId, payload.roomId, payload.chatId);
        break;

      // Community routes
      case SupportedCommunityMessages.CreateCommunity:
        communities.create(payload.name, payload.owner)
        break;

      case SupportedCommunityMessages.UpdateCommunity:
        communities.delete(payload.id)
        break;

      case SupportedCommunityMessages.DeleteCommunity:
        communities.delete(payload.id)
        break;

      case SupportedCommunityMessages.GetCommunity:
        ws.send(JSON.stringify(communities.getCommunity(payload.id)))
        break;

      case SupportedCommunityMessages.GetCommunities:
        ws.send(JSON.stringify(communities.getCommunities()))
        break;

      case SupportedCommunityMessages.AddAdmin:
        communities.addAdmin(payload.roomId, payload.userId, payload.userName)
        break;

      case SupportedCommunityMessages.RemoveAdmin:
        communities.removeAdmin(payload.roomId, payload.userId)
        break;

      case SupportedCommunityMessages.JoinCommunity:
        communities.joinCommunity(payload.roomId, payload.userId, payload.userName)
        break;

      case SupportedCommunityMessages.LeaveCommunity:
        communities.leaveCommunity(payload.roomId, payload.userId)
        break;

      case SupportedCommunityMessages.GiveTimeout:
        communities.giveTimeout(payload.roomId, payload.userId, payload.timeout)
        break;

      case SupportedCommunityMessages.ClearTimeout:
        communities.clearTimeout(payload.roomId, payload.userId)
        break;

      default:
        throw new Error("Invalid request")
    }

  } catch (err) {
    console.log("err", err)
  }
}

export default requestHandler
