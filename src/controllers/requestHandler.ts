import { WebSocket } from "ws"
import { IncomingMessage, SupportedChatMessages } from "../schema/chat"
import chat from "./chat"
import { SupportedCommunityMessages } from "../schema/community";
import communities from "./communities";
import { authenticate, authorize, UserType } from "../middlewares/auth";
import { verifyToken } from "../utils/jwt";

const requestHandler = (ws: WebSocket, message: IncomingMessage, token: string) => {
  try {
    // Auth
    const tokenData = verifyToken(token);
    authenticate(tokenData.userId)

    let userType: UserType | null = null;

    // Chat routes
    const { type, payload } = message;

    switch (type) {
      case SupportedChatMessages.GetChat:
        ws.send(JSON.stringify(chat.getChats(payload.roomId, payload.limit, payload.offset)))
        break;
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

      // Todo(Auth) - OP & Admin & Owner
      case SupportedChatMessages.DeleteChat:
        userType = authorize(payload.roomId, tokenData.userId, ["user", "admin", "owner"])
        chat.deleteChat(payload.roomId, payload.chatId, tokenData.userId, userType);
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

      // Todo(Auth) - Owner only
      case SupportedCommunityMessages.UpdateCommunity:
        userType = authorize(payload.id, tokenData.userId, ["owner"]);
        communities.update(payload)
        break;

      // Todo(Auth) - Owner only
      case SupportedCommunityMessages.DeleteCommunity:
        userType = authorize(payload.id, tokenData.userId, ["owner"]);
        communities.delete(payload.id)
        break;

      case SupportedCommunityMessages.GetCommunity:
        ws.send(JSON.stringify(communities.getCommunity(payload.id)))
        break;

      case SupportedCommunityMessages.GetCommunities:
        ws.send(JSON.stringify(communities.getCommunities()))
        break;

      // Todo(Auth) - Owner only
      case SupportedCommunityMessages.AddAdmin:
        userType = authorize(payload.roomId, tokenData.userId, ["owner"]);
        communities.addAdmin(payload.roomId, payload.userId, payload.userName)
        break;

      // Todo(Auth) - Owner only
      case SupportedCommunityMessages.RemoveAdmin:
        userType = authorize(payload.roomId, tokenData.userId, ["owner"]);
        communities.removeAdmin(payload.roomId, payload.userId)
        break;

      case SupportedCommunityMessages.JoinCommunity:
        communities.joinCommunity(payload.roomId, payload.userId, payload.userName)
        break;

      case SupportedCommunityMessages.LeaveCommunity:
        communities.leaveCommunity(payload.roomId, payload.userId)
        break;

      // Todo(Auth) - Admin & Owner 
      case SupportedCommunityMessages.GiveTimeout:
        userType = authorize(payload.roomId, tokenData.userId, ["owner", "admin"]);
        communities.giveTimeout(payload.roomId, payload.userId, payload.timeout)
        break;

      // Todo(Auth) - Admin & Owner 
      case SupportedCommunityMessages.ClearTimeout:
        userType = authorize(payload.roomId, tokenData.userId, ["owner", "admin"]);
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
