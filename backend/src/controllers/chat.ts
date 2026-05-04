import { CommunityRole } from "../middlewares/auth";
import { SupportedChatMessages } from "../schema/chat";
import { SupportedOutgoingUserMessages } from "../schema/user";
import { activeClients } from "../store/clients";
import { prisma } from "../utils/db";
import communities from "./communities";
import user, { UserId } from "./user";

class Chat {
  constructor() {}

  async getChats(
    communityId: string,
    limit?: number | undefined,
    offset?: number | undefined,
  ) {
    return await prisma.chatMessage.findMany({
      where: { communityId },
      include: { 
        upvotes: true,
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      skip: offset,
      take: limit,
    });
  }

  async addChat(communityId: string, content: string, senderId: string) {
    // Validate timeout
    const activeTimeout = await prisma.timeout.findFirst({
      where: { userId: senderId, communityId, expiresAt: { gt: new Date() } },
    });

    if (activeTimeout) {
      throw new Error(
        "You are in timeout until " + activeTimeout.expiresAt.toISOString(),
      );
    }

    return await prisma.chatMessage.create({
      data: {
        senderId,
        content,
        communityId,
      },
    });
  }

  async updateChat(
    chatId: string,
    content: string,
    userId: UserId,
    communityRole: CommunityRole,
  ) {
    const existChat = await prisma.chatMessage.findFirst({
      where: { id: chatId },
    });

    if (!existChat) {
      throw new Error("chat not found");
    }

    if (communityRole === "USER" && userId !== existChat.senderId) {
      throw new Error("Unauthorized access");
    }

    return await prisma.chatMessage.update({
      where: { id: chatId },
      data: { content },
    });
  }

  async deleteChat(chatId: string, userId: UserId, userRole: CommunityRole) {
    const existChat = await prisma.chatMessage.findFirst({
      where: { id: chatId },
    });

    if (!existChat) {
      return null;
    }

    if (userRole === "USER" && existChat?.senderId !== userId) {
      throw new Error("Unauthorized access");
    }

    await prisma.chatMessage.update({
      data: { content: "", isDeleted: true },
      where: { id: chatId },
    });

    return await communities.broadcastMessage(existChat?.communityId);
  }

  async updatePrivateChat(chatId: string, senderId: string, content: string){
    try {
      const res = await prisma.privateMessage.update({
        where: { id: chatId, senderId },
        data: { content }
      });

      const recipentId = res.recipientId;
      const senderClient = activeClients.get(senderId)
      const recipientClient = activeClients.get(recipentId)

      if(senderClient && senderClient.OPEN){
        senderClient.send(
          JSON.stringify({
            type: SupportedOutgoingUserMessages.GetPrivateChatHistory,
            data: await user.getPrivateChatHistory(senderId),
          }),
        );

        const privateChats = await this.getPrivateChats(senderId, recipentId)

        senderClient.send(
          JSON.stringify({
            type: SupportedChatMessages.GetPrivateChat,
            data: {
              roomId: recipentId,
              messages: privateChats,
            },
          }),
        );
      }

      if(recipientClient && recipientClient.OPEN){
        recipientClient.send(
          JSON.stringify({
            type: SupportedOutgoingUserMessages.GetPrivateChatHistory,
            data: await user.getPrivateChatHistory(recipentId),
          }),
        );
        recipientClient.send(
          JSON.stringify({
            type: SupportedChatMessages.GetPrivateChat,
            data: {
              roomId: recipentId,
              messages: await this.getPrivateChats(recipentId, senderId),
            },
          }),
        );
      }
    } catch (err) {
      throw new Error("error while update")
    }
  }

  async deletePrivateChat(chatId: string, senderId: UserId){
    try {
      const res = await prisma.privateMessage.update({
        where: { id: chatId, senderId },
        data: { content: "", isDeleted: true },
      });

      const recipentId = res.recipientId;
      const senderClient = activeClients.get(senderId);
      const recipientClient = activeClients.get(recipentId);

      // Send updated private chat messages to sender
      if (senderClient && senderClient.OPEN) {
        senderClient.send(
          JSON.stringify({
            type: SupportedOutgoingUserMessages.GetPrivateChatHistory,
            data: await user.getPrivateChatHistory(senderId),
          }),
        );
        senderClient.send(
          JSON.stringify({
            type: SupportedChatMessages.GetPrivateChat,
            data: {
              roomId: recipentId,
              messages: await this.getPrivateChats(senderId, recipentId),
            },
          }),
        );
      }

      // Send updated private chat messages to recipient
      if (recipientClient && recipientClient.OPEN) {
        recipientClient.send(
          JSON.stringify({
            type: SupportedOutgoingUserMessages.GetPrivateChatHistory,
            data: await user.getPrivateChatHistory(recipentId),
          }),
        );
        recipientClient.send(
          JSON.stringify({
            type: SupportedChatMessages.GetPrivateChat,
            data: {
              roomId: recipentId,
              messages: await this.getPrivateChats(recipentId, senderId),
            },
          }),
        );
      }
    } catch (err) {
      throw new Error("cannot delete chat");
    }
  }

  async upvote(userId: string, roomId: string, chatId: string) {
    const message = await prisma.chatMessage.findFirst({
      where: { id: chatId },
      include: {
        upvotes: { select: { id: true } },
      },
    });

    if (!message) {
      throw new Error("Message not found");
    }

    const alreadyUpvoted = message.upvotes.some((user) => user.id === userId);

    await prisma.chatMessage.update({
      where: { id: chatId },
      data: {
        upvotes: alreadyUpvoted
          ? {
              disconnect: [{ id: userId }],
            }
          : {
              connect: [{ id: userId }],
            },
      },
      include: {
        _count: {
          select: {
            upvotes: true,
          },
        },
      },
    });

    return await communities.broadcastMessage(roomId);
  }

  async getPrivateChats(
    userId: string,
    partnerId: string,
    limit?: number | undefined,
    offset?: number | undefined,
  ) {
    return await prisma.privateMessage.findMany({
      where: {
        OR: [
          { senderId: userId, recipientId: partnerId },
          { senderId: partnerId, recipientId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      skip: offset,
      take: limit,
      // orderBy: { createdAt: 'asc' },
    });
  }

  async sendPrivateMessage(recipientId: string, content: string, senderId: string) {
    await prisma.privateMessage.create({
      data: {
        senderId,
        recipientId,
        content,
      },
    });

    return this.getPrivateChats(senderId, recipientId)
  }
}

export default new Chat();
