import bcrypt from "bcrypt";

export const generateHash = async (rawString: string) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(rawString, salt)
}

export const verifyHash = async (rawString: string, hash: string) => {
  return await bcrypt.compare(rawString, hash)
}
