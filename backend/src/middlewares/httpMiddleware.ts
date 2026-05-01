import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../utils/db";
import { Role } from "../generated/prisma/enums";

export const requireRole = (role: Role) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validateRole(req, role);
      next();
    } catch (err) {
      res.status(401).send({
        status: false,
        message: err instanceof Error ? err.message : "Unauthorized",
      });
    }
  };
};

export const validateRole = async (req: Request, role: Role) => {
  // Try to get token from NextAuth session cookie first
  let token =
    req.cookies?.["next-auth.session-token"] ||
    req.cookies?.["__Secure-next-auth.session-token"] ||
    req.cookies?.["next-auth.csrf-token"] ||
    req.cookies?.token;

  // Fallback to Authorization header for backward compatibility
  if (!token) {
    token = req.headers.authorization?.split(" ")[1];
  }

  if (!token) {
    throw new Error("Unauthorized");
  }

  const tokenData = verifyToken(token);
  const userData = await prisma.user.findFirst({
    where: { id: tokenData.userId },
    select: { id: true, role: true },
  });

  if (!userData) throw new Error("Unauthorized");

  // Role hierarchy: ADMIN can do anything USER can do
  const roleHierarchy: Role[] = ["USER", "ADMIN"];
  if (roleHierarchy.indexOf(userData.role) < roleHierarchy.indexOf(role)) {
    throw new Error("Forbidden");
  }

  return userData;
};
