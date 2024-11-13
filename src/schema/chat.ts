import { z } from "zod";
import { IncomingCommunityMessages, Member } from "./community";

export enum SupportedChatMessages {
  AddChat = "ADD_CHAT",
  DeleteChat = "DELETE_CHAT",
  UpvoteMessage = "UPVOTE_MESSAGE",
  DownvoteMessage = "DOWNVOTE_MESSAGE"
}

export type IncomingChatMessages = {
  type: SupportedChatMessages.AddChat,
  payload: AddChatType
} | {
  type: SupportedChatMessages.DeleteChat,
  payload: DeleteChatType
} | {
  type: SupportedChatMessages.UpvoteMessage,
  payload: UpvoteMessageType
} | {
  type: SupportedChatMessages.DownvoteMessage,
  payload: DownvoteMessageType
}

export const AddChat = z.object({
  roomId: z.string(),
  content: z.string(),
  sender: Member
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

export const DownvoteMessage = z.object({
  userId: z.string(),
  roomId: z.string(),
  chatId: z.string()
})

export type IncomingMessage = IncomingChatMessages | IncomingCommunityMessages;

export type AddChatType = z.infer<typeof AddChat>;
export type DeleteChatType = z.infer<typeof DeleteChat>;
export type UpvoteMessageType = z.infer<typeof UpvoteMessage>;
export type DownvoteMessageType = z.infer<typeof DownvoteMessage>
