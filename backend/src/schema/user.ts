import { z } from "zod";

// Define the schema for the address
const AddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  area: z.string().min(1, "Area is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
});

// Define the schema for the user
export const UserSchema = z.object({
  // id: z.number().int().positive("ID must be a positive integer"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Mobile number must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  address: AddressSchema.optional(),
});

const Login = z.object({
  email: z.string(),
  password: z.string()
})

export type LoginType = z.infer<typeof Login>

export enum SupportedUserMessages {
  ChatHistory = "CHAT_HISTORY"
}

export enum SupportedOutgoingUserMessages {
  ChatHistory = "CHAT_HISTORY"
}

export type IncomingUserMessage = {
  type: SupportedUserMessages.ChatHistory,
  payload: null,
}

export type OutgoingUserMessage = {
  type: SupportedOutgoingUserMessages;
  data: string & { __json_string_brand: never }
}

export default UserSchema;
