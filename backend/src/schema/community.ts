import { z } from "zod";
import { IChat } from "../controllers/chat";

export enum SupportedCommunityMessages {
  CreateCommunity = "CREATE_COMMUNITY",
  UpdateCommunity = "UPDATE_COMMUNITY",
  DeleteCommunity = "DELETE_COMMUNITY",
  GetCommunity = "GET_COMMUNITY",
  GetCommunities = "GET_COMMUNITIES",
  AddAdmin = "ADD_ADMIN",
  RemoveAdmin = "REMOVE_ADMIN",
  JoinCommunity = "JOIN_COMMUNITY",
  LeaveCommunity = "LEAVE_COMMUNITY",
  Search = "SEARCH",
  GiveTimeout = "GIVE_TIMEOUT",
  ClearTimeout = "CLEAR_TIMEOUT",

  BrodcastMessages = "BROADCAST_MESSAGE",
  BroadcastUpvote = "UPVOTE_MESSAGE"

}

export const Member = z.object({
  userId: z.string(),
  name: z.string(),
})

export type IncomingCommunityMessages = {
  type: SupportedCommunityMessages.CreateCommunity,
  payload: CreateCommunityType
} | {
  type: SupportedCommunityMessages.UpdateCommunity,
  payload: UpdateCommunityType
} | {
  type: SupportedCommunityMessages.DeleteCommunity,
  payload: DeleteCommunityType
} | {
  type: SupportedCommunityMessages.GetCommunity,
  payload: GetCommunityType
} | {
  type: SupportedCommunityMessages.GetCommunities,
  payload: null
} | {
  type: SupportedCommunityMessages.UpdateCommunity,
  payload: UpdateCommunityType
} | {
  type: SupportedCommunityMessages.AddAdmin,
  payload: AddAdminType
} | {
  type: SupportedCommunityMessages.RemoveAdmin,
  payload: RemoveAdminType
} | {
  type: SupportedCommunityMessages.JoinCommunity,
  payload: JoinCommunityType
} | {
  type: SupportedCommunityMessages.LeaveCommunity,
  payload: LeaveCommunityType
} | {
  type: SupportedCommunityMessages.Search,
  payload: SearchCommunityType
} | {
  type: SupportedCommunityMessages.GiveTimeout,
  payload: GiveTimeoutType
} | {
  type: SupportedCommunityMessages.ClearTimeout,
  payload: ClearTimeoutType
};

export type OutgoingCommunityMessages = {
  type: SupportedCommunityMessages.BrodcastMessages,
  data: {
    roomId: string;
    messages: BrodcastMessages
  },
} | {
  type: SupportedCommunityMessages.BroadcastUpvote,
  data: {
    roomId: string;
    messageId: string;
    message: IChat;
  }
}

const CreateCommunity = z.object({
  name: z.string(),
  owner: Member
})

const UpdateCommunity = z.object({
  id: z.string(),
  name: z.string(),
  // owner: Member,
  // admin: z.array(Member),
  // member: z.array(Member),
  // timeouts: z.object({
  //   userId: z.string(),
  //   timeout: z.number()
  // })
})

const DeleteCommunity = z.object({
  id: z.string()
})

const GetCommunity = z.object({
  id: z.string()
})

const JoinCommunity = z.object({
  roomId: z.string(),
  userName: z.string(),
})

const LeaveCommunity = z.object({
  roomId: z.string(),
})

const SearchCommunity = z.object({
  search: z.string(),
})

const AddAdmin = z.object({
  roomId: z.string(),
  userId: z.string(),
  userName: z.string(),
})

const RemoveAdmin = z.object({
  roomId: z.string(),
  userId: z.string(),
})

const GiveTimeout = z.object({
  roomId: z.string(),
  userId: z.string(),
  timeout: z.number(),
})

const ClearTimeout = z.object({
  roomId: z.string(),
  userId: z.string(),
})


const BrodcastUpvotes = z.object({
  roomId: z.string(),
  messageId: z.string()
})

export type CreateCommunityType = z.infer<typeof CreateCommunity>;
export type UpdateCommunityType = z.infer<typeof UpdateCommunity>;
export type DeleteCommunityType = z.infer<typeof DeleteCommunity>;
export type GetCommunityType = z.infer<typeof GetCommunity>;
export type JoinCommunityType = z.infer<typeof JoinCommunity>;
export type LeaveCommunityType = z.infer<typeof LeaveCommunity>;
export type SearchCommunityType = z.infer<typeof SearchCommunity>;
export type AddAdminType = z.infer<typeof AddAdmin>;
export type RemoveAdminType = z.infer<typeof RemoveAdmin>;
export type GiveTimeoutType = z.infer<typeof GiveTimeout>;
export type ClearTimeoutType = z.infer<typeof ClearTimeout>;

export type BrodcastMessages = IChat[];
export type BrodcastUpvotes = IChat;
