import { IncomingMessage } from "../schema";
import { SupportedChatMessages, OutgoingChatMessages } from "../schema/chat";
import chat from "../controllers/chat";
import { SupportedCommunityMessages } from "../schema/community";
import communities from "../controllers/communities";
import { authenticate, authorize, CommunityRole } from "../middlewares/auth";
import { TokenData } from "../utils/jwt";
import { CustomWebsocket } from "../server";
import {
  SupportedOutgoingUserMessages,
  SupportedUserMessages,
} from "../schema/user";
import user from "../controllers/user";
import { activeClients } from "../store/clients";

const wsRequestHandler = async (
  ws: CustomWebsocket,
  message: IncomingMessage,
  tokenData: TokenData,
) => {
  try {
    // Auth
    await authenticate(tokenData.userId);

    let communityRole: CommunityRole | null = null;

    const { type, payload } = message;

    switch (type) {
      // User Routes
      case SupportedUserMessages.ChatHistory:
        ws.send(
          JSON.stringify({
            type: SupportedOutgoingUserMessages.ChatHistory,
            data: await user.getChatHistory(tokenData.userId),
          }),
        );
        break;

      case SupportedUserMessages.Search:
        if (payload && 'search' in payload) {
          const searchResults = await user.searchUser(payload.search);
          ws.send(
            JSON.stringify({
              type: SupportedOutgoingUserMessages.Search,
              data: searchResults,
            }),
          );
        }
        break;

      case SupportedUserMessages.GetPrivateChatHistory:
        const privateChatHistory = await user.getPrivateChatHistory(tokenData.userId);
        ws.send(
          JSON.stringify({
            type: "GET_PRIVATE_CHAT_HISTORY",
            data: privateChatHistory,
          }),
        );
        break;

      // Chat routes
      case SupportedChatMessages.GetChat:
        ws.send(
          JSON.stringify({
            type: OutgoingChatMessages.GetChat,
            data: {
              roomId: payload.roomId,
              messages: await chat.getChats(
                payload.roomId,
                payload.limit,
                payload.offset,
              ),
            },
          }),
        );
        break;
      case SupportedChatMessages.AddChat:
        const sender = {
          userId: tokenData.userId,
          name: tokenData.userName,
        };
        await chat.addChat(payload.roomId, payload.content, sender.userId);
        await communities.broadcastMessage(payload.roomId);
        break;

      // Todo(Auth) - OP & Admin & Owner
      case SupportedChatMessages.DeleteChat:
        communityRole = await authorize(payload.roomId, tokenData.userId, [
          "USER",
          "ADMIN",
          "OWNER",
        ]);
        await chat.deleteChat(payload.chatId, tokenData.userId, communityRole);
        break;

      case SupportedChatMessages.UpdateChat:
        communityRole = await authorize(payload.roomId, tokenData.userId, [
          "USER",
        ]);
        await chat.updateChat(
          payload.chatId,
          payload.content,
          tokenData.userId,
          communityRole,
        );
        await communities.broadcastMessage(payload.roomId);
        break;

      case SupportedChatMessages.UpvoteMessage:
        await chat.upvote(tokenData.userId, payload.roomId, payload.chatId);
        break;

      case SupportedChatMessages.GetPrivateChat:
        if (payload && 'recipientId' in payload) {
          const privateMessages = await chat.getPrivateChats(
            tokenData.userId,
            payload.recipientId,
            payload.limit,
            payload.offset
          );
          ws.send(
            JSON.stringify({
              type: "GET_PRIVATE_CHAT",
              data: {
                roomId: payload.recipientId,
                messages: privateMessages,
              },
            }),
          );
        }
        break;

      case SupportedChatMessages.SendPrivateMessage:
        if (payload && 'recipientId' in payload && 'content' in payload) {
          const newMessages = await chat.sendPrivateMessage(payload.recipientId, payload.content, tokenData.userId);
          
          // Send the message back to the sender
          ws.send(
            JSON.stringify({
              type: "GET_PRIVATE_CHAT",
              data: {
                roomId: payload.recipientId,
                messages: newMessages,
              },
            }),
          );
          
          // Send updated private chat history
          const updatedChatHistory = await user.getPrivateChatHistory(tokenData.userId);
          ws.send(
            JSON.stringify({
              type: "GET_PRIVATE_CHAT_HISTORY",
              data: updatedChatHistory,
            }),
          );
          
          // Broadcast to recipient when they're online
          const recipientConnection = activeClients.get(payload.recipientId);
          if (recipientConnection) {
            // Send the new message to the recipient
            recipientConnection.send(
              JSON.stringify({
                type: "GET_PRIVATE_CHAT",
                data: {
                  roomId: tokenData.userId, // For recipient, the sender is the roomId
                  messages: newMessages,
                },
              }),
            );
            
            // Update recipient's private chat history
            const recipientChatHistory = await user.getPrivateChatHistory(payload.recipientId);
            recipientConnection.send(
              JSON.stringify({
                type: "GET_PRIVATE_CHAT_HISTORY",
                data: recipientChatHistory,
              }),
            );
          }
        }
        break;

      // Community routes
      case SupportedCommunityMessages.CreateCommunity:
        await communities.create(
          payload.name, 
          payload.category,
          tokenData.userId
        );
        // Send updated ChatHistory to include the newly created community
        ws.send(
          JSON.stringify({
            type: SupportedOutgoingUserMessages.ChatHistory,
            data: await user.getChatHistory(tokenData.userId),
          }),
        );
        break;

      // Todo(Auth) - Owner only
      case SupportedCommunityMessages.UpdateCommunity:
        communityRole = await authorize(payload.id, tokenData.userId, [
          "OWNER",
        ]);
        await communities.update(payload);
        break;

      // Todo(Auth) - Owner only
      case SupportedCommunityMessages.DeleteCommunity:
        communityRole = await authorize(payload.id, tokenData.userId, [
          "OWNER",
        ]);
        await communities.delete(payload.id);
        break;

      case SupportedCommunityMessages.GetCommunity:
        ws.send(JSON.stringify(await communities.getCommunity(payload.id)));
        break;

      case SupportedCommunityMessages.GetCommunities:
        ws.send(JSON.stringify({
          type: "GET_COMMUNITIES",
          data: await communities.getCommunities()
        }));
        break;

      case SupportedCommunityMessages.SearchCommunity:
        ws.send(
          JSON.stringify({
            type: "SEARCH_COMMUNITY",
            data: await communities.searchCommunity(payload.search, payload.category),
          }),
        );
        break;

      // Todo(Auth) - Owner only
      case SupportedCommunityMessages.AddAdmin:
        communityRole = await authorize(payload.roomId, tokenData.userId, [
          "OWNER",
        ]);
        await communities.addAdmin(
          payload.roomId,
          payload.userId,
          payload.userName,
        );
        break;

      // Todo(Auth) - Owner only
      case SupportedCommunityMessages.RemoveAdmin:
        communityRole = await authorize(payload.roomId, tokenData.userId, [
          "OWNER",
        ]);
        await communities.removeAdmin(payload.roomId, payload.userId);
        break;

      case SupportedCommunityMessages.JoinCommunity:
        await communities.joinCommunity(
          payload.roomId,
          tokenData.userId,
        );
        ws.send(JSON.stringify({
          type: "JOIN_COMMUNITY",
        }));
        // Refresh ChatHistory to show the newly joined community
        ws.send(
          JSON.stringify({
            type: SupportedOutgoingUserMessages.ChatHistory,
            data: await user.getChatHistory(tokenData.userId),
          }),
        );
        break;

      case SupportedCommunityMessages.LeaveCommunity:
        await communities.leaveCommunity(payload.roomId, tokenData.userId);
        ws.send(
          JSON.stringify({
            type: SupportedCommunityMessages.LeaveCommunity,
            data: {
              success: true
            }
          })
        )
        // Refresh ChatHistory to show the updated community list after leaving
        ws.send(
          JSON.stringify({
            type: SupportedOutgoingUserMessages.ChatHistory,
            data: await user.getChatHistory(tokenData.userId),
          }),
        );
        break;

      // Todo(Auth) - Admin & Owner
      case SupportedCommunityMessages.GiveTimeout:
        communityRole = await authorize(payload.roomId, tokenData.userId, [
          "OWNER",
          "ADMIN",
        ]);
        await communities.giveTimeout(
          payload.roomId,
          payload.userId,
          payload.timeout,
        );
        break;

      // Todo(Auth) - Admin & Owner
      case SupportedCommunityMessages.ClearTimeout:
        communityRole = await authorize(payload.roomId, tokenData.userId, [
          "OWNER",
          "ADMIN",
        ]);
        await communities.clearTimeout(payload.roomId, payload.userId);
        break;

      default:
        throw new Error("Invalid request");
    }
  } catch (err) {
    ws.send(
      JSON.stringify({
        type: "ERROR",
        message: err instanceof Error ? err.message : "Unknown error",
      }),
    );
  }
};

export default wsRequestHandler;
