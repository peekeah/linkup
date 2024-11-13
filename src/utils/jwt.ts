import jwt from "jsonwebtoken";

export const generateToken = (payload: string) => {
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
    return jwt.verify(token, secret)
  } catch (err) {
    console.log("err", err)
  }
}
