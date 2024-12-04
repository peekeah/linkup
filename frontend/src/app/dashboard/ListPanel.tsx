import { Avatar } from "@/components/ui/avatar";
import { Search } from "@/components/ui/search";
import { userList } from "@/mock";

import ProfilePicture from "@/assets/person-messaging.png";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useContext } from "react";
import { ChatContext } from "@/store/chat";

const ListPanel = () => {

  const { chatHistory } = useContext(ChatContext);

  return (
    <div className="h-full p-3 py-5 space-y-3">
      <Search className="rounded-full h-12" placeholder="Search" />
      <div className="overflow-y-auto">
        {
          !chatHistory?.length ?
            <div>No recent chats</div> :
            chatHistory?.map((item, index) => (
              <div key={item.communityId} className="">
                <div className="flex gap-3">
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
                {index !== userList.length - 1 ? <Separator className="m-2" /> : null}
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default ListPanel;
