import { useContext } from "react";

import { SupportedIncomingUserMessages } from "@/@types/user";
import { IncomingMessage } from "@/@types";
import { ChatContext, ChatHistory } from "@/store/chat";
import { CommunityContext } from "@/store/communities";
import { SupportedIncomingChatMessages } from "@/@types/chat";
import { SupportedIncomingCommunityMessage } from "@/@types/community";
import { toast } from "sonner";

const useHandleMessage = () => {
  const { updateChatHistory, updateChatMessages, updateSingleChatMessage, updateSearchResults, updatePrivateChats } =
    useContext(ChatContext);

  const { updateCommunities } = useContext(CommunityContext);

  const handleMessage = async (rawMessage: string) => {
    try {
      const message = JSON.parse(rawMessage) as IncomingMessage;

      let roomId = "";
      let messages = [];

      switch (message.type) {
        // Incoming user messages
        case SupportedIncomingUserMessages.ChatHistory:
          const chatHistory = message.data as ChatHistory[];
          updateChatHistory(chatHistory);
          break;

        case SupportedIncomingUserMessages.Search:
          const searchResults = message.data as any[];
          updateSearchResults(searchResults);
          break;

        case SupportedIncomingUserMessages.GetPrivateChatHistory:
          const privateChatHistory = message.data as any[];
          updatePrivateChats(privateChatHistory);
          break;
        case SupportedIncomingChatMessages.GetChat:
          messages = message.data?.messages;
          roomId = message?.data?.roomId;
          updateChatMessages(roomId, messages);
          break;
        case SupportedIncomingCommunityMessage.BroadcastMessages:
          roomId = message.data?.roomId;
          messages = message?.data?.messages;
          updateChatMessages(roomId, messages);
          break;
        case SupportedIncomingCommunityMessage.BroadcastUpvote:
          roomId = message?.data?.roomId;
          const newMessage = message?.data?.message;
          const messageId = message?.data?.messageId;
          updateSingleChatMessage(roomId, messageId, newMessage);
          break;

        case SupportedIncomingCommunityMessage.GetCommunities:
          updateCommunities({
            communities: message.data.communities,
            communityCount: message.data.communityCount,
            memberCount: message.data.memberCount,
            onlineMembers: message.data.onlineMembers,
            categories: message.data.categories || []
          });
          break;

        case SupportedIncomingCommunityMessage.Search:
          updateCommunities({ communities: message?.data?.communities, searchText: "" });
          break;

        case SupportedIncomingCommunityMessage.JoinCommunity:
          toast("Successfully joined community");
          break;

        default:
          console.log("unsupported message:", message);
      }
    } catch (err) {
      console.log("err while parsing response", err);
    }
  };

  return { handleMessage };
};

export default useHandleMessage;
