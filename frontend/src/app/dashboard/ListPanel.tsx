import { Avatar } from "@/components/ui/avatar";
import { Search } from "@/components/ui/search";
import { userList } from "@/mock";

import ProfilePicture from "@/assets/person-messaging.png";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "@/store/chat";
import { cx } from "class-variance-authority";

const ListPanel = () => {

  const { chatHistory } = useContext(ChatContext);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  useEffect(() => {
    if (!chatHistory?.length) {
      return
    }
    setSelectedChat(() => {
      return chatHistory[0]?.communityId
    })
  }, [chatHistory])

  return (
    <div className="h-full space-y-3">
      <div className="p-3 py-5">
        <Search className="rounded-full h-12" placeholder="Search" />
      </div>
      <Separator orientation="horizontal" />
      <div className="overflow-y-auto m-0">
        {
          !chatHistory?.length ?
            <div>No recent chats</div> :
            chatHistory?.map((item, index) => (
              <div key={item.communityId} className={
                cx(
                  "cursor-pointer",
                  selectedChat === item.communityId ? "bg-gray-300" : ""
                )
              }
                onClick={() => setSelectedChat(item.communityId)}
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
