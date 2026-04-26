import {
  OutgoingCommunityMessages,
  SupportedCommunityMessages,
} from "../schema/community";
import { activeClients } from "../store/clients";
import { prisma } from "../utils/db";
import { UserId } from "./user";

export interface ICommunity {
  id: string;
  name: string;
  category?: string;
  owner: IMember;
  admin: IMember[];
  member: IMember[];
  timeouts: ITimeout[];
}

export interface UpdateCommunity {
  id: string;
  name: string;
}

export interface IMember {
  userId: UserId;
  name: string;
}

interface ITimeout {
  userId: UserId;
  timeout: number;
}

class Community {
  constructor() {}

  async create(name: string, category: string, ownerId: string) {
    return await prisma.community.create({
      data: {
        name,
        category,
        owner: {
          connect: { id: ownerId },
        },
      },
    });
  }

  async update({ id, name }: UpdateCommunity) {
    await prisma.community.update({
      where: { id },
      data: { name },
    });
  }

  async delete(id: string) {
    return prisma.community.delete({
      where: { id },
    });
  }

  async getCommunities() {
    const communities = await prisma.community.findMany();
    const communityCount = communities.length;
    const memberCount = (await prisma.user.findMany()).length;
    const onlineMembers = activeClients.size;
    
    // Extract unique categories from communities
    const categories = [...new Set(communities
      .map(community => community.category)
      .filter((category): category is string => category !== null && category !== undefined)
    )];

    return {
      communities,
      communityCount,
      memberCount,
      onlineMembers,
      categories,
    };
  }

  async getCommunity(id: string) {
    const community = await prisma.community.findFirst({
      where: { id },
    });

    if (!community) {
      throw new Error("community not found");
    }

    return community;
  }

  async joinCommunity(id: string, userId: string) {
    return await prisma.community.update({
      data: { members: { connect: { id: userId } } },
      where: { id },
    });
  }

  async leaveCommunity(id: string, userId: UserId) {
    return await prisma.community.update({
      data: { members: { disconnect: { id: userId } } },
      where: { id },
    });
  }

  async addAdmin(id: string, userId: UserId, userName: string) {
    return await prisma.community.update({
      data: { admins: { connect: { id: userId } } },
      where: { id },
    });
  }

  async removeAdmin(id: string, userId: UserId) {
    return await prisma.community.update({
      data: { admins: { disconnect: { id: userId } } },
      where: { id },
    });
  }

  async searchCommunity(search: string, category?: string) {
    const whereClause: any = {};
    
    if (search) {
      whereClause.name = { contains: search, mode: "insensitive" };
    }
    
    if (category && category !== "All") {
      whereClause.category = category;
    }

    const communities = await prisma.community.findMany({
      where: whereClause,
    });
    return { communities };
  }

  // Todo: Add authorization
  async giveTimeout(id: string, userId: string, timeout: number) {
    const isCommunityMember = await prisma.community.findFirst({
      where: {
        id,
        members: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!isCommunityMember) {
      throw new Error("User is not a member of the community");
    }

    return await prisma.timeout.create({
      data: {
        userId,
        communityId: id,
        expiresAt: new Date(Date.now() + timeout * 1000),
      },
    });
  }

  async clearTimeout(id: string, userId: UserId) {
    const isCommunityMember = await prisma.community.findFirst({
      where: {
        id,
        members: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!isCommunityMember) {
      throw new Error("User is not a member of the community");
    }

    await prisma.timeout.deleteMany({
      where: {
        userId,
        communityId: id,
      },
    });
  }

  async broadcastMessage(communityId: string) {
    const community = await prisma.community.findFirst({
      where: { id: communityId },
      include: { members: true },
    });

    if (!community) throw new Error("Community not found");

    const messages = await prisma.chatMessage.findMany({
      where: { communityId },
      include: { sender: true, upvotes: true },
    });

    community.members.forEach((member) => {
      const conn = activeClients.get(member.id);
      const response: OutgoingCommunityMessages = {
        type: SupportedCommunityMessages.BrodcastMessages,
        data: {
          roomId: communityId,
          messages,
        },
      };
      if (conn) {
        conn.send(JSON.stringify(response));
      }
    });
  }

  async broadcastUpvotes(communityId: string, messageId: string) {
    const community = await prisma.community.findFirst({
      where: { id: communityId },
      include: { members: true },
    });

    if (!community) throw new Error("Community not found");

    const message = await prisma.chatMessage.findFirst({
      where: { id: messageId },
      include: { sender: true, upvotes: true },
    });

    if (!message) {
      throw new Error("Message not found");
    }

    community.members.forEach((member) => {
      const conn = activeClients.get(member.id);
      if (conn) {
        const response: OutgoingCommunityMessages = {
          type: SupportedCommunityMessages.BroadcastUpvote,
          data: {
            communityId,
            messageId,
            message,
          },
        };
        conn.send(JSON.stringify(response));
      }
    });
  }
}

export default new Community();
