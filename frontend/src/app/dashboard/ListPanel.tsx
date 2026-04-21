import { ChangeEventHandler, useCallback, useContext, useEffect, useState } from "react";
import { Search } from "@/components/ui/search";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { ChatContext, ChatHistory } from "@/store/chat";
import { cx } from "class-variance-authority";
import { Separator } from "@/components/ui/separator";
import useSendMessage from "@/hooks/useSendMessage";
import { SupportedOutgoingCommunityMessages } from "@/@types/community";
import { SupportedChatMessages } from "@/@types/chat";
import InputAlert from "./InputAlert";
import { Button } from "@/components/ui/button";
import { getDate } from "@/lib/utils";
import { toast } from "sonner";
import { IconPlus, IconUser } from "@tabler/icons-react";
import { AvatarImage } from "@radix-ui/react-avatar";


const ListPanel = () => {

  const { state, updateSelectedChat } = useContext(ChatContext);
  const { chatHistory, selectedChat } = state;
  const [searchFilter, setSearchFilter] = useState("");
  const [filteredChats, setFilteredChats] = useState<ChatHistory[]>([]);

  const sendMessage = useSendMessage();
  const [community, setCommunity] = useState("");

  const handleActiveTab = useCallback((chat: ChatHistory) => {
    updateSelectedChat(chat)
    sendMessage({
      type: SupportedChatMessages.GetChat,
      payload: {
        roomId: chat.communityId
      }
    })
  }, [sendMessage, updateSelectedChat])

  useEffect(() => {
    if (chatHistory && chatHistory?.length) {
      setFilteredChats(chatHistory)
      const selectedChatExists = selectedChat
        ? chatHistory.some((chat) => chat.communityId === selectedChat.communityId)
        : false;

      // Auto-select only on initial load or when current selection is no longer in the list.
      if (!selectedChatExists) {
        handleActiveTab(chatHistory[0])
      }
    }
  }, [chatHistory, handleActiveTab, selectedChat])

  useEffect(() => {
    if (!searchFilter) {
      return setFilteredChats(chatHistory)
    }
    setFilteredChats(
      chatHistory
        .filter(item =>
          item.communityName.toLowerCase().includes(searchFilter.toLowerCase())
        )
    )
  }, [chatHistory, searchFilter])

  const handleAddCommunity = () => {
    sendMessage({
      type: SupportedOutgoingCommunityMessages.CreateCommunity,
      payload: {
        name: community,
      }
    })

    toast("Community", {
      description: "Community created Successfully"
    })
    setCommunity("")
  }

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setCommunity(e.target.value)
  }

  const onModalClose = () => {
    setCommunity("")
  }

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchFilter(e.target.value)
  }

  return (
    <div className="h-full lg:min-w-sm">
      <div className="p-2 py-3">
        <Search
          className="rounded-full h-12 flex-1"
          placeholder="Search"
          value={searchFilter}
          onChange={handleSearchChange}
        />
      </div>
      <Separator orientation="horizontal" />
      <div className="flex items-center justify-between p-3">
        <div className="text-xs text-neutral tracking-widest">COMMUNITIES</div>
        <InputAlert
          title="Add community"
          placeholder="Community name"
          value={community}
          triggerButton={
            <Button size={"icon"} className="rounded-md size-6">
              <IconPlus />
            </Button>
          }
          onChange={onInputChange}
          onSubmit={handleAddCommunity}
          onClose={onModalClose}
        />
      </div>
      <div>
        {
          !filteredChats?.length ?
            <div className="p-4 opacity-75">No chats found</div> :
            filteredChats?.map((item, index) => (
              <div key={item.communityId} className={
                cx(
                  "cursor-pointer hover:bg-primary/30",
                  selectedChat?.communityId === item.communityId ? "bg-primary/70 hover:bg-primay/30" : ""
                )
              }
                onClick={() => handleActiveTab(item)}
              >
                {index === 0 && <Separator orientation="horizontal" />}

                <div className="flex gap-3 p-3 items-center">
                  <Avatar className="shadow-md">
                    <AvatarImage><IconUser /></AvatarImage>
                    <AvatarFallback><IconUser /></AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div className="text-heading">{item.communityName}</div>
                      <div className="text-sm opacity-60">{getDate(item?.date)}</div>
                    </div>
                    <div className="text-sm opacity-40">{item.message}</div>
                  </div>
                </div>
                <Separator />
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default ListPanel;
