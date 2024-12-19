import { IncomingMessage } from "../schema";
import { SupportedChatMessages, OutgoingChatMessages } from "../schema/chat"
import chat from "../controllers/chat"
import { SupportedCommunityMessages } from "../schema/community";
import communities from "../controllers/communities";
import { authenticate, authorize, UserType } from "../middlewares/auth";
import { TokenData } from "../utils/jwt";
import { CustomWebsocket } from "../server";
import { SupportedOutgoingUserMessages, SupportedUserMessages } from "../schema/user";
import user from "../controllers/user";

const wsRequestHandler = (ws: CustomWebsocket, message: IncomingMessage, tokenData: TokenData) => {
  try {
    // Auth
    authenticate(tokenData.userId)

    let userType: UserType | null = null;

    const { type, payload } = message;

    switch (type) {
      // User Routes
      case SupportedUserMessages.ChatHistory:
        ws.send(JSON.stringify({
          type: SupportedOutgoingUserMessages.ChatHistory,
          data: user.getChatHistory(tokenData.userId)
        }))
        break;

      // Chat routes
      case SupportedChatMessages.GetChat:
        ws.send(JSON.stringify({
          type: OutgoingChatMessages.GetChat,
          data: {
            roomId: payload.roomId,
            messages: chat.getChats(payload.roomId, payload.limit, payload.offset)
          }
        }))
        break;
      case SupportedChatMessages.AddChat:
        const sender = {
          userId: tokenData.userId,
          name: tokenData.userName
        }
        chat.addChat(payload.roomId, payload.content, sender)
        communities.broadcastMessage(payload.roomId)
        break;

      // Todo(Auth) - OP & Admin & Owner
      case SupportedChatMessages.DeleteChat:
        userType = authorize(payload.roomId, tokenData.userId, ["user", "admin", "owner"])
        chat.deleteChat(payload.roomId, payload.chatId, tokenData.userId, userType);
        communities.broadcastMessage(payload.roomId)
        break;

      case SupportedChatMessages.UpvoteMessage:
        chat.upvote(tokenData.userId, payload.roomId, payload.chatId);
        communities.broadcastUpvotes(payload.roomId, payload.chatId)
        break;

      // Community routes
      case SupportedCommunityMessages.CreateCommunity:
        communities.create(payload.name, { userId: tokenData.userId, name: tokenData.userName })
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

      case SupportedCommunityMessages.Search:
        ws.send(JSON.stringify({
          type: "SEARCH",
          data: communities.searchCommunity(payload.search)
        }))
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
        communities.joinCommunity(payload.roomId, tokenData.userId, payload.userName)
        break;

      case SupportedCommunityMessages.LeaveCommunity:
        communities.leaveCommunity(payload.roomId, tokenData.userId)
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

export default wsRequestHandler;
