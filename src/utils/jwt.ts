import jwt from "jsonwebtoken";
import { getEnv } from "../config";

export interface TokenData {
  userId: string;
  email: string;
  userName: string;
  exp?: number;
  iat?: number;
}


const secret = getEnv("JWT_SECRET")

export const generateToken = (payload: TokenData) => {
  try {
    return jwt.sign(payload, secret, {
      expiresIn: "1w"
    })

  } catch (err) {
    console.log("err", err)
  }
}

export const verifyToken = (token: string) => {
  try {
    const decodedToken = jwt.verify(token, secret) as TokenData;
    if (!decodedToken) throw new Error("Unauthorized access")
    return decodedToken
  } catch (err) {
    throw err;
  }
}
