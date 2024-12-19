import { IncomingChatMessage, OutgoingChatMessage } from "./chat";
import { IncomingCommunityMessage, OutgoingCommunityMessage } from "./community";
import { IncomingUserMessage, OutgoingUserMessage } from "./user";

export type OutgoingMessage = OutgoingUserMessage | OutgoingChatMessage | OutgoingCommunityMessage;

export type IncomingMessage = IncomingCommunityMessage | IncomingUserMessage | IncomingChatMessage;
