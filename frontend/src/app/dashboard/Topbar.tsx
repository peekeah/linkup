import { Avatar } from "@/components/ui/avatar";
import ProfilePicture from "@/assets/user";
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
          <SearchInput />
        </div>
        <div>
          <Avatar className="shadow-md p-2 cursor-pointer">
            <ProfilePicture className="h-full w-full" />
          </Avatar>
        </div>
      </div>
    </div>
  )
}

export default Topbar;
