import { Avatar } from "@/components/ui/avatar";
import { MemberDetails } from "./page";

import { Button } from "@/components/ui/button";
import { IconUsers, IconX } from "@tabler/icons-react";
import { AvatarImage } from "@radix-ui/react-avatar";

interface ProfileDetailsProps {
  toggleDrawer: () => void;
  memberDetails: MemberDetails;
}

const ProfileDetails = ({ memberDetails, toggleDrawer }: ProfileDetailsProps) => {
  return (
    <>
      <div className="p-5 flex flex-col gap-3 items-center relative">
        <Avatar className="shadow-md p-3 w-[200px] h-[200px]">
          <AvatarImage><IconUsers /></AvatarImage>
        </Avatar>
        <div className="space-y-1">
          <div className="text-center font-outfit text-[36px] text-extrabold">{memberDetails.name}</div>
          <div className="text-center font-outfit text-[20px]">{memberDetails.title}</div>
          <div className="pt-3">{memberDetails.bio}</div>
        </div>
        <div className="absolute right-5 top-5">
          <Button
            size={"icon"}
            className="!h-10 !w-10 p-1.5 text-primary"
            onClick={toggleDrawer}
          >
            <IconX />
          </Button>
        </div>
      </div>
    </>
  )
}

export default ProfileDetails;
