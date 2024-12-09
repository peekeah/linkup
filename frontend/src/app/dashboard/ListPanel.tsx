import { useContext, useEffect } from "react";
import { Search } from "@/components/ui/search";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";

import ProfilePicture from "@/assets/person-messaging.png";
import { userList } from "@/mock";
import { Separator } from "@/components/ui/separator";
import { ChatContext, ChatHistory } from "@/store/chat";
import { cx } from "class-variance-authority";

const ListPanel = () => {

  const { state, updateSelectedChat } = useContext(ChatContext);
  const { chatHistory, selectedChat } = state;

  useEffect(() => {
    if (chatHistory && chatHistory?.length) {
      console.log("hh", chatHistory)
      // updateSelectedChat(chatHistory[0])
    }
  }, [chatHistory])

  const handleActiveTab = (chat: ChatHistory) => {
    updateSelectedChat(chat)
  }

  return (
    <div className="h-full space-y-3">
      <div className="p-3 py-5">
        <Search className="rounded-full h-12" placeholder="Search" />
      </div>
      <Separator orientation="horizontal" />
      <div className="!m-0">
        {
          !chatHistory?.length ?
            <div>No recent chats</div> :
            chatHistory?.map((item, index) => (
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
                      <div className="text-[#1E1E1E] opacity-60">{item?.date}</div>
                    </div>
                    <div className="text-[#1E1E1E] opacity-60">{item.content}</div>
                  </div>
                </div>
                {/* #Fixme: Fix Saperator */}
                {index !== userList.length - 1 ? <Separator /> : null}
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default ListPanel;
