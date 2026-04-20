import { SupportedOutgoingUserMessages } from "../schema/user";
import { activeClients } from "../store/clients";
import { generateHash, verifyHash } from "../utils/bcrypt";
import { prisma } from "../utils/db";
import { generateToken } from "../utils/jwt";

export type UserId = string;

export interface IUser {
  id: UserId;
  name: string;
  email: string;
  mobile: string;
  bio: string;
  password: string;
  // address?: IAddress;
  // chatHistory: ChatHistory[];
  // connection: WebSocket;
}

export interface UpdateUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
}

interface LastMessage {
  content: string;
  date: Date;
}

// #NOTE: Add for private message
export interface ChatHistory extends LastMessage {
  communityId: string;
  communityName: string;
}

interface IAddress {
  street: string;
  area: string;
  city: string;
  state: string;
  country: string;
}

class User {
  constructor() {}

  async create(user: IUser) {
    const data = {
      ...user,
      password: await generateHash(user.password),
    };

    const res = await prisma.user.create({ data });
    return res;
  }

  async login(email: string, password: string) {
    try {
      const user = await prisma.user.findFirst({ where: { email } });

      if (!user) {
        throw new Error("User does not exist");
      }

      const comparePassword = await verifyHash(password, user.password);

      if (!comparePassword) {
        throw new Error("Password is incorrect");
      }

      const userData = {
        userId: user.id,
        userName: user.name,
        email: user.email,
        mobile: user.mobile,
        bio: user.bio,
        token: generateToken({
          userId: user.id,
          email: user.email,
          userName: user.name ?? "",
        }),
      };

      return userData;
    } catch (err) {
      throw err;
    }
  }

  async update(user: UpdateUser) {
    const { id, ...userData } = user;
    const res = await prisma.user.update({
      where: { id: user.id },
      data: userData,
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

    const { password: _, ...userData } = user;

    return userData;
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
    });
  }

  // #TODO: Fix personal messages
  async getChatHistory(id: UserId) {
    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new Error("user not found");
    }

    const communities = await prisma.community.findMany({
      where: {
        members: { some: { id } },
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
