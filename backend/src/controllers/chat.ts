import { CommunityRole } from "../middlewares/auth";
import { prisma } from "../utils/db";
import communities from "./communities";
import { UserId } from "./user";

class Chat {
  constructor() {}

  async getChats(
    communityId: string,
    limit?: number | undefined,
    offset?: number | undefined,
  ) {
    return await prisma.chatMessage.findMany({
      where: { communityId },
      include: { upvotes: true },
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
