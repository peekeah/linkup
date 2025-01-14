import { Avatar } from "@/components/ui/avatar";
import { MemberDetails } from "./page";
import Image from "next/image";

import Communities from "@/assets/communities.png";
import ButtonIcon from "@/components/ui/button-icon";
import CloseIcon from "@/assets/close";

interface ProfileDetailsProps {
  toggleDrawer: () => void;
  memberDetails: MemberDetails;
}

const ProfileDetails = ({ memberDetails, toggleDrawer }: ProfileDetailsProps) => {
  return (
    <>
      <div className="p-5 flex flex-col gap-3 items-center relative">
        <Avatar className="shadow-md p-3 w-[200px] h-[200px]">
          <Image src={Communities} alt="Profile pic" />
        </Avatar>
        <div className="space-y-1">
          <div className="text-center font-outfit text-[36px] text-extrabold">{memberDetails.name}</div>
          <div className="text-center font-outfit text-[20px]">{memberDetails.title}</div>
          <div className="pt-3">{memberDetails.bio}</div>
        </div>
        <div className="absolute right-5 top-5">
          <ButtonIcon
            noBorder
            className="!h-10 !w-10 p-1.5 text-primary"
            onClick={toggleDrawer}
            icon={CloseIcon}
          />
        </div>
      </div>
    </>
  )
}

export default ProfileDetails;
