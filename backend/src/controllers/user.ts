import { Prisma } from "../generated/prisma/client";
import { SupportedOutgoingUserMessages } from "../schema/user";
import { activeClients } from "../store/clients";
import { prisma } from "../utils/db";

export type UserId = string;

interface LastMessage {
  content: string;
  date: Date;
}

export interface ChatHistory extends LastMessage {
  communityId: string;
  communityName: string;
}

class User {
  constructor() {}

  async create(user: Prisma.UserCreateInput) {
    const data = {
      ...user,
    };

    const res = await prisma.user.create({ data });
    return res;
  }

  async update(id: string, user: Prisma.UserUpdateInput) {
    const res = await prisma.user.update({
      where: { id },
      data: {...user, id},
    });

    return res;
  }

  async delete(id: string) {
    await prisma.user.delete({ where: { id } });
  }

  async getUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        bio: true,
      },
    });
  }

  async getUser(id: string) {
    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new Error("user not found");
    }

    return user;
  }

  async updateChatHistory(
    id: UserId,
    communityId: string,
    communityName: string,
    content: string,
  ) {
    const community = await prisma.community.findFirst({
      where: { id: communityId },
      include: { members: true },
    });

    if (!community) {
      return null;
    }

    let user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      return null;
    }

    await prisma.chatMessage.create({
      data: {
        communityId,
        senderId: user.id,
        content,
      },
    });

    // Broadcast recent chats to all clients
    community.members.forEach(async ({ id }) => {
      const conn = activeClients.get(id);
      if (conn) {
        conn.send(
          JSON.stringify({
            type: SupportedOutgoingUserMessages.ChatHistory,
            data: {
              communityId,
              communityName,
              content,
            },
          }),
        );
      }
    });
  }

  async searchUser(search: string) {
    return await prisma.user.findMany({
      where: { name: { contains: search, mode: "insensitive" } },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        image: true,
      },
    });
  }

  async getPrivateChatHistory(id: UserId) {
    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new Error("user not found");
    }

    // Get all private messages where the user is either sender or recipient
    const privateMessages = await prisma.privateMessage.findMany({
      where: {
        OR: [
          { senderId: id },
          { recipientId: id }
        ]
      },
      include: {
        sender: { select: { id: true, name: true, email: true, bio: true, image: true } },
        recipient: { select: { id: true, name: true, email: true, bio: true, image: true } }
      },
      orderBy: { createdAt: "desc" },
    });

    // Group messages by conversation partner and get the latest message from each conversation
    const conversationMap = new Map();
    
    privateMessages.forEach(message => {
      const partnerId = message.senderId === id ? message.recipientId : message.senderId;
      const partner = message.senderId === id ? message.recipient : message.sender;
      
      if (!conversationMap.has(partnerId) || conversationMap.get(partnerId).createdAt < message.createdAt) {
        conversationMap.set(partnerId, {
          id: partnerId,
          recipientId: partnerId,
          recipientName: partner.name,
          recipient: partner,
          message: message.content,
          date: message.createdAt.toISOString(),
          type: 'private' as const,
          createdAt: message.createdAt.toISOString(),
          updatedAt: message.updatedAt.toISOString()
        });
      }
    });

    return Array.from(conversationMap.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getChatHistory(id: UserId) {
    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new Error("user not found");
    }

    const communities = await prisma.community.findMany({
      where: {
        OR: [
          { members: { some: { id } } },
          { admins: { some: { id } } },
          { owner: { id } }
        ]
      },
      include: {
        chatMessages: {
          where: { isDeleted: false },
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: { select: { id: true, name: true } },
          },
        },
      },
    });

    return communities
      .map((c) => {
        const latestMessage = c.chatMessages[0];

        return {
          communityId: c.id,
          communityName: c.name,
          message: latestMessage?.content || null,
          sender: latestMessage?.sender?.name || null,
          createdAt: latestMessage?.createdAt || null,
        };
      })
      .sort((a, b) => {
        // Communities with messages come first
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;

        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }
}

export default new User();
