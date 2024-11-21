import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "@/components/ui/search";

import ProfilePicture from "@/assets/person-messaging.png";
import Image from "next/image";

const Topbar = () => {
  return (
    <div className="w-screen flex justify-between items-center p-3">
      <div className="text-[28px] font-bold font-serif">
        <span className="text-secondary">Link</span>
        <span className="text-[#777777]">up</span>
      </div>
      <div>
        <Search className="rounded-full h-16 w-[700px]" placeholder="Search" />
      </div>
      <div>
        <Avatar className="shadow-md p-3">
          <Image src={ProfilePicture} alt="Profile pic" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

export default Topbar;
