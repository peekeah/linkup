import { z } from "zod";
import { IncomingCommunityMessages, Member } from "./community";
import { IncomingUserMessage, OutgoingUserMessage } from "./user";

export enum SupportedChatMessages {
  GetChat = "GET_CHAT",
  AddChat = "ADD_CHAT",
  DeleteChat = "DELETE_CHAT",
  UpvoteMessage = "UPVOTE_MESSAGE",
}

export type IncomingChatMessages = {
  type: SupportedChatMessages.GetChat,
  payload: GetChatType
} | {
  type: SupportedChatMessages.AddChat,
  payload: AddChatType
} | {
  type: SupportedChatMessages.DeleteChat,
  payload: DeleteChatType
} | {
  type: SupportedChatMessages.UpvoteMessage,
  payload: UpvoteMessageType
}

export const GetChat = z.object({
  roomId: z.string(),
  offset: z.number().optional(),
  limit: z.number().optional(),
}).refine(
  (data) => (data.offset === undefined && data.limit === undefined) ||
    (data.offset !== undefined && data.limit !== undefined),
  {
    message: "Both offset and limit must be provided together",
    path: ["offset"], // or path: [] for a general error
  }
);

export const AddChat = z.object({
  roomId: z.string(),
  content: z.string(),
  // sender: Member
})

export const DeleteChat = z.object({
  roomId: z.string(),
  chatId: z.string()
})

export const UpvoteMessage = z.object({
  userId: z.string(),
  roomId: z.string(),
  chatId: z.string()
})

export type IncomingMessage = IncomingChatMessages | IncomingCommunityMessages | IncomingUserMessage;

export type GetChatType = z.infer<typeof GetChat>;
export type AddChatType = z.infer<typeof AddChat>;
export type DeleteChatType = z.infer<typeof DeleteChat>;
export type UpvoteMessageType = z.infer<typeof UpvoteMessage>;
