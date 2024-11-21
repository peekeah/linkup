import { Avatar } from "@/components/ui/avatar";
import { Search } from "@/components/ui/search";
import { userList } from "@/mock";
import { Separator } from "@radix-ui/react-separator";


import ProfilePicture from "@/assets/person-messaging.png";
import Image from "next/image";

const ListPanel = () => {
  return (
    <div className="h-full p-3 space-y-3">
      <Search className="rounded-full h-12" placeholder="Search" />
      <div className="overflow-y-auto">
        {
          userList.map((item, index) => (
            <div key={index} className="space-y-3">
              <div className="flex gap-3">
                <Avatar className="shadow-md p-3">
                  <Image src={ProfilePicture} alt="Profile pic" />
                </Avatar>
                <div className="w-full">
                  <div className="flex justify-between">
                    <div className="text-heading">{item.name}</div>
                    <div className="text-[#1E1E1E] opacity-60">{item.lastMessage.time}</div>
                  </div>
                  <div className="text-[#1E1E1E] opacity-60">{item.lastMessage.content}</div>
                </div>
              </div>
              {/* #Fixme: Fix Saperator */}
              {index !== userList.length - 1 ? <Separator className="my-4" /> : null}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ListPanel;
