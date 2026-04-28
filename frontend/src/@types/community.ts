import { z } from "zod";
import { UserId } from "./user";
import { Message } from "@/store/chat";

export enum SupportedOutgoingCommunityMessages {
  CreateCommunity = "CREATE_COMMUNITY",
  DeleteCommunity = "DELETE_COMMUNITY",
  UpdateCommunity = "UPDATE_COMMUNITY",
  GetCommunity = "GET_COMMUNITY",
  GetCommunities = "GET_COMMUNITIES",
  AddAdmin = "ADD_ADMIN",
  RemoveAdmin = "REMOVE_ADMIN",
  JoinCommunity = "JOIN_COMMUNITY",
  LeaveCommunity = "LEAVE_COMMUNITY",
  SearchCommunity = "SEARCH_COMMUNITY",
  GiveTimeout = "GIVE_TIMEOUT",
  ClearTimeout = "CLEAR_TIMEOUT",
}

export enum SupportedIncomingCommunityMessage {
  BroadcastMessages = "BROADCAST_MESSAGE",
  BroadcastUpvote = "UPVOTE_MESSAGE",
  GetCommunities = "GET_COMMUNITIES",
  SearchCommunity = "SEARCH_COMMUNITY",
  JoinCommunity = "JOIN_COMMUNITY",
  LeaveCommunity = "LEAVE_cOMMUNITY",
}

export interface Member {
  userId: UserId;
  name: string;
}

export interface Community {
  id: string;
  name: string;
  owner: Member;
  admin: Member[];
  member: Member[];
  timeouts: Timeout[];
}

interface Timeout {
  userId: UserId;
  timeout: number;
}

export const Member = z.object({
  userId: z.string(),
  name: z.string(),
});

export type OutgoingCommunityMessage =
  | {
      type: SupportedOutgoingCommunityMessages.CreateCommunity;
      payload: CreateCommunityType;
    }
  | {
      type: SupportedOutgoingCommunityMessages.UpdateCommunity;
      payload: UpdateCommunityType;
    }
  | {
      type: SupportedOutgoingCommunityMessages.DeleteCommunity;
      payload: DeleteCommunityType;
    }
  | {
      type: SupportedOutgoingCommunityMessages.GetCommunity;
      payload: GetCommunityType;
    }
  | {
      type: SupportedOutgoingCommunityMessages.GetCommunities;
      payload?: null;
    }
  | {
      type: SupportedOutgoingCommunityMessages.UpdateCommunity;
      payload: UpdateCommunityType;
    }
  | {
      type: SupportedOutgoingCommunityMessages.AddAdmin;
      payload: AddAdminType;
    }
  | {
      type: SupportedOutgoingCommunityMessages.RemoveAdmin;
      payload: RemoveAdminType;
    }
  | {
      type: SupportedOutgoingCommunityMessages.JoinCommunity;
      payload: JoinCommunityType;
    }
  | {
      type: SupportedOutgoingCommunityMessages.LeaveCommunity;
      payload: LeaveCommunityType;
    }
  | {
      type: SupportedOutgoingCommunityMessages.GiveTimeout;
      payload: GiveTimeoutType;
    }
  | {
      type: SupportedOutgoingCommunityMessages.ClearTimeout;
      payload: ClearTimeoutType;
    }
  | {
      type: SupportedOutgoingCommunityMessages.SearchCommunity;
      payload?: SearchPayload;
    };

export type IncomingCommunityMessage =
  | {
      type: SupportedIncomingCommunityMessage.BroadcastMessages;
      data: {
        roomId: string;
        messages: BroadcastMessages;
      };
    }
  | {
      type: SupportedIncomingCommunityMessage.BroadcastUpvote;
      data: {
        roomId: string;
        messageId: string;
        message: Message;
      };
    }
  | {
      type: SupportedIncomingCommunityMessage.GetCommunities;
      data: GetCommunityIncomingPayload;
    }
  | {
      type: SupportedIncomingCommunityMessage.SearchCommunity;
      data: {
        communities: {
          id: string;
          name: string;
          ownerId: string;
        }[];
      };
    }
  | {
      type: SupportedIncomingCommunityMessage.JoinCommunity;
    } | {
      type: SupportedIncomingCommunityMessage.LeaveCommunity,
      data: {
        success: boolean
      }
    };

type GetCommunityIncomingPayload = {
  communities: {
    id: string;
    name: string;
    ownerId: string;
  }[];
  communityCount: number;
  memberCount: number;
  onlineMembers: number;
  categories: string[];
};

export const CreateCommunity = z.object({
  name: z.string(),
  category: z.string(),
});

export const UpdateCommunity = z.object({
  id: z.string(),
  name: z.string(),
});

export const DeleteCommunity = z.object({
  id: z.string(),
});

export const GetCommunity = z.object({
  id: z.string(),
});

export const JoinCommunity = z.object({
  roomId: z.string(),
});

export const LeaveCommunity = z.object({
  roomId: z.string(),
  // userId: z.string(),
});

export const AddAdmin = z.object({
  roomId: z.string(),
  userId: z.string(),
  userName: z.string(),
});

export const RemoveAdmin = z.object({
  roomId: z.string(),
  userId: z.string(),
});

export const GiveTimeout = z.object({
  roomId: z.string(),
  userId: z.string(),
  timeout: z.number(),
});

export const ClearTimeout = z.object({
  roomId: z.string(),
  userId: z.string(),
});

export const BrodcastUpvotes = z.object({
  roomId: z.string(),
  messageId: z.string(),
});

export const SearchPayload = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
});

export type CreateCommunityType = z.infer<typeof CreateCommunity>;
export type UpdateCommunityType = z.infer<typeof UpdateCommunity>;
export type DeleteCommunityType = z.infer<typeof DeleteCommunity>;
export type GetCommunityType = z.infer<typeof GetCommunity>;
export type JoinCommunityType = z.infer<typeof JoinCommunity>;
export type LeaveCommunityType = z.infer<typeof LeaveCommunity>;
export type AddAdminType = z.infer<typeof AddAdmin>;
export type RemoveAdminType = z.infer<typeof RemoveAdmin>;
export type GiveTimeoutType = z.infer<typeof GiveTimeout>;
export type ClearTimeoutType = z.infer<typeof ClearTimeout>;
export type SearchPayload = z.infer<typeof SearchPayload>;

export type BroadcastMessages = Message[];
export type BrodcastUpvotes = Message;
