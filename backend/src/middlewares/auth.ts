import { prisma } from "../utils/db";

export type CommunityRole = "ADMIN" | "OWNER" | "USER";

export const authenticate = async (userId: string) => {
  const existUser = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!existUser) throw new Error("USER not found");

  return existUser;
};

export const authorize = async (
  communityId: string,
  userId: string,
  acceptedRoles: CommunityRole[],
) => {
  const community = await prisma.community.findFirst({
    where: { id: communityId },
    include: {
      admins: { select: { id: true } },
      owner: { select: { id: true } },
      members: { select: { id: true } },
    },
  });

  if (!community) throw new Error("Community not found");

  const isOwner = community.owner.id === userId;
  const isAdmin = community.admins.some((admin) => admin.id === userId);
  const isMember = community.members.some((member) => member.id === userId);

  if (acceptedRoles.includes("OWNER") && isOwner) {
    return "OWNER";
  }

  if (acceptedRoles.includes("ADMIN") && isAdmin) {
    return "ADMIN";
  }

  if (acceptedRoles.includes("USER") && isMember) {
    return "USER";
  }

  throw new Error("Unauthorized access");
};
