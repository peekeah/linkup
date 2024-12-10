import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import ProfilePicture from "@/assets/person-messaging.png";
import Image from "next/image";
import SearchInput from "./SearchInput";

const Topbar = () => {
  return (
    <div className="w-screen p-3 relative">
      <div className="flex justify-between items-center">
        <div className="text-[28px] font-bold font-serif">
          <span className="text-secondary">Link</span>
          <span className="text-[#777777]">up</span>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
          {/* <Search className="rounded-full h-16 w-[700px]" placeholder="Search" /> */}
          <SearchInput />
        </div>
        <div>
          <Avatar className="shadow-md p-3">
            <Image src={ProfilePicture} alt="Profile pic" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}

export default Topbar;
