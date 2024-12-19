import { IncomingChatMessages } from "./chat";
import { IncomingCommunityMessages } from "./community";
import { IncomingUserMessage } from "./user";


export type IncomingMessage = IncomingChatMessages| IncomingCommunityMessages| IncomingUserMessage;