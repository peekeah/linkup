import { OutgoingChatMessage } from "./chat";
import { IncomingCommunityMessage } from "./community";
import { IncomingUserMessage, OutgoingUserMessage } from "./user";

export type OutgoingMessage = OutgoingUserMessage | OutgoingChatMessage;

export type IncomingMessage = IncomingCommunityMessage | IncomingUserMessage;
