import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../utils/db";
import { Role } from "../generated/prisma/enums";

export const requireRole = (role: Role) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send({ status: false, message: "Unauthorized" });

    const tokenData = verifyToken(token);
    const userData = await prisma.user.findFirst({
      where: { id: tokenData.userId },
      select: { role: true },
    });

    if (userData?.role !== role) {
      return res.status(403).send({ status: false, message: "Forbidden" });
    }

    next();
  };
};