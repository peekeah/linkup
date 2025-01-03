import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import { Search } from "@/components/ui/search";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";

import ProfilePicture from "@/assets/person-messaging.png";
import { userList } from "@/mock";
import { ChatContext, ChatHistory } from "@/store/chat";
import { cx } from "class-variance-authority";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import useSendMessage from "@/hooks/useSendMessage";
import { SupportedOutgoingCommunityMessages } from "@/@types/community";
import InputAlert from "./InputAlert";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDate } from "@/lib/utils";


const ListPanel = () => {

  const { state, updateSelectedChat } = useContext(ChatContext);
  const { chatHistory, selectedChat } = state;
  const [searchFilter, setSearchFilter] = useState("");
  const [filteredChats, setFilteredChats] = useState<ChatHistory[]>([]);

  const { toast } = useToast();
  const sendMessage = useSendMessage();
  const [community, setCommunity] = useState("");

  useEffect(() => {
    if (chatHistory && chatHistory?.length) {
      updateSelectedChat(chatHistory[0])
      setFilteredChats(chatHistory)
    }
  }, [chatHistory])

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
  }, [searchFilter])

  const handleActiveTab = (chat: ChatHistory) => {
    updateSelectedChat(chat)
  }

  const handleAddCommunity = () => {
    sendMessage({
      type: SupportedOutgoingCommunityMessages.CreateCommunity,
      payload: {
        name: community,
      }
    })
    toast({
      title: "Community",
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
    <div className="h-full space-y-3">
      <div className="p-3 py-5 flex items-center gap-3 justify-between">
        <Search
          className="rounded-full h-12 flex-1"
          placeholder="Search"
          value={searchFilter}
          onChange={handleSearchChange}
        />
        <InputAlert
          title="Add community"
          placeholder="Community name"
          value={community}
          triggerButton={
            <Button className="rounded-full h-10 w-10">
              <Plus className="!h-6 !w-6" />
            </Button>
          }
          onChange={onInputChange}
          onSubmit={handleAddCommunity}
          onClose={onModalClose}
        />
      </div>
      <Separator orientation="horizontal" />
      <div className="!m-0">
        {
          !filteredChats?.length ?
            <div>No recent chats</div> :
            filteredChats?.map((item, index) => (
              <div key={item.communityId} className={
                cx(
                  "cursor-pointer hover:bg-gray-200",
                  selectedChat?.communityId === item.communityId ? "bg-gray-300 hover:bg-gray-300" : ""
                )
              }
                onClick={() => handleActiveTab(item)}
              >
                <div className="flex gap-3 p-3">
                  <Avatar className="shadow-md p-3">
                    <Image src={ProfilePicture} alt="Profile pic" />
                  </Avatar>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div className="text-heading">{item.communityName}</div>
                      <div className="text-[#1E1E1E] opacity-60">{getDate(item?.date)}</div>
                    </div>
                    <div className="text-[#1E1E1E] opacity-60">{item.content}</div>
                  </div>
                </div>
                {index !== userList.length - 1 ? <Separator /> : null}
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default ListPanel;
