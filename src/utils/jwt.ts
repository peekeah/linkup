import jwt from "jsonwebtoken";

export interface TokenData {
  userId: string;
  email: string;
  userName: string;
  exp?: number;
  iat?: number;
}

export const generateToken = (payload: TokenData) => {
  try {
    const secret = process.env.JWT_SECRET || "dummy password"
    return jwt.sign(payload, secret, {
      expiresIn: "1w"
    })

  } catch (err) {
    console.log("err", err)
  }
}

export const verifyToken = (token: string) => {
  try {
    const secret = process.env.JWT_SECRET || "dummy password"
    const decodedToken = jwt.verify(token, secret) as TokenData;
    if (!decodedToken) throw new Error("Unauthorized access")
    return decodedToken
  } catch (err) {
    throw err;
  }
}
