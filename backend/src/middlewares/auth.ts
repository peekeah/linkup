import communities from "../controllers/communities";
import user, { UserId } from "../controllers/user"

export type UserType = "admin" | "owner" | "user";

export const authenticate = (userId: string) => {
  const existUser = user.getUser(userId)

  if (!existUser) throw new Error("User not found")

  return existUser;

}

export const authorize = (roomId: string, userId: UserId, userType: UserType[]) => {
  const existRoom = communities.getCommunity(roomId);

  if (!existRoom) throw new Error("Community not found");

  for (const role of userType) {
    if (role === "owner") {
      if (existRoom.owner.userId === userId) {
        return "owner"
      }
    } if (role === "user") {
      for (const admin of existRoom.member) {
        if (admin.userId === userId) {
          return "user"
        }
      }
    } else {
      for (const admin of existRoom.admin) {
        if (admin.userId === userId) {
          return "admin"
        }
      }
    }
  }
  throw new Error("Unauthorized access")
}
