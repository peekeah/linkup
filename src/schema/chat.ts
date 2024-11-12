import { z } from "zod";
import { IncomingCommunityMessages } from "./community";

export type IncomingMessages = IncomingChatMessages | IncomingCommunityMessages;

export enum SupportedChatMessages {
  AddChat = "ADD_CHAT",
  DeleteChat = "DELETE_CHAT",
  Upvote = "UPVOTE",
  Downvote = "DOWNVOTE"
}

export type IncomingChatMessages = {
  payload: AddChatType
  type: SupportedChatMessages.AddChat,
} | {
  type: SupportedChatMessages.DeleteChat,
  payload: DeleteChatType
} | {
  type: SupportedChatMessages.Upvote,
  payload: DeleteChatType
} | {
  type: SupportedChatMessages.Downvote,
  payload: DownvoteType
}

const AddChat = z.object({
  roomId: z.string(),
  content: z.string(),
  sender: z.string()
})

const DeleteChat = z.object({
  roomId: z.string(),
  chatId: z.string()
})

const Upvote = z.object({
  userId: z.string(),
  roomId: z.string(),
  chatId: z.string()
})

const Downvote = z.object({
  userId: z.string(),
  roomId: z.string(),
  chatId: z.string()
})

export type AddChatType = z.infer<typeof AddChat>;
export type DeleteChatType = z.infer<typeof DeleteChat>;
export type UpvoteType = z.infer<typeof Upvote>;
export type DownvoteType = z.infer<typeof Downvote>
