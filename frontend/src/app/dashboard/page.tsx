"use client";
import { useContext, useState } from "react";

import { Separator } from "@/components/ui/separator";
import ChatPanel from "./ChatPanel";
import ListPanel from "./ListPanel";
import Sidebar from "./sidebar";
import Topbar from "./Topbar";
import { AuthContext } from "@/store/auth";
import ProfileDetails from "./ProfileDetails";

export interface MemberDetails {
  name: string;
  title: string;
  bio: string;
}

type ProfileDrawer = {
  open: false;
  data: null
} | {
  open: true,
  data: MemberDetails
}

const Dashboard = () => {
  const [profileDrawer, setProfileDrawer] = useState<ProfileDrawer>({
    open: false,
    data: null
  })

  const toggleDrawer = () => {
    setProfileDrawer(prev => {
      if (prev.open) {
        return ({
          open: false,
          data: null
        })
      } else {
        return ({
          open: true,
          data: {
            name: "Alex F",
            title: "Full stack Developer",
            bio: `An enthustiac web developer,
            Expert in React, Express, MongoDB & TailwindCSS`
          }
        })
      }
    })
  }

  return (
    <div className="h-screen flex flex-col bg-white font-serif">
      <Topbar />
      <Separator />
      <div className="flex w-screen">
        <Sidebar />
        <Separator orientation="vertical" />
        <div className="w-[450px] h-full"><ListPanel /></div>
        <Separator orientation="vertical" />
        <div className="flex-1"><ChatPanel toggleDrawer={toggleDrawer} /> </div>
        {
          profileDrawer.open ?
            <>
              <Separator orientation="vertical" />
              <div className="w-3/12">
                <ProfileDetails
                  toggleDrawer={toggleDrawer}
                  memberDetails={profileDrawer.data}
                />
              </div>
            </> : null
        }
      </div>
    </div>
  )
}

export default Dashboard;
