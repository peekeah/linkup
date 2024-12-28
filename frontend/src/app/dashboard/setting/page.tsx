"use client"
import { useState } from "react";

import { Separator } from "@/components/ui/separator";
import Sidebar from "./sidebar";
import Profile from "./profile";

const settingTabs = [
  {
    id: "profile",
    title: "Profile",
    description: "Name, email, password..."
  },
  {
    id: "notification",
    title: "Notification",
    description: "Ringtones"
  },
  {
    id: "help",
    title: "Help",
    description: "Help center, Licenses"
  },
]

const Component = ({ tabId }: { tabId: string }) => {
  // #TODO: Update after development of remaining pages
  switch (tabId) {
    case "profile":
      return <Profile />
    /*
    case "notification":
      return <Notification />
    case "help":
      return <Help />
    */
    default:
      return <Profile />
  }
}

const Setting = () => {
  const [selectedTab, setSelectedTab] = useState(settingTabs[0].id);

  const handleActiveTab = (tabId: string) => {
    // #TODO: Update after development of remaining pages
    if (tabId === "profile") {
      setSelectedTab(tabId)
    }
  }
  return (
    <div className="flex h-full w-full">
      <Sidebar
        tabs={settingTabs}
        selectedTab={selectedTab}
        handleActiveTab={handleActiveTab}
      />
      <Separator orientation="vertical" />
      <div className="text-3xl w-full h-full">
        <Component tabId={selectedTab} />
      </div>
    </div>
  )
}

export default Setting;
