import MessageIcon from "@/assets/message-icon.svg"
import ButtonIcon from "@/components/ui/button-icon";
import SettingsIcon from "@/assets/settings.svg"
import NotificationIcon from "@/assets/notification.svg"
import PeopleIcon from "@/assets/people.svg"
import UserIcon from "@/assets/user.svg"
import { ComponentType, useState } from "react";
import { useRouter } from "next/navigation";

const sidebarTabs = [
  {
    id: "chats",
    title: "Chats",
    link: "",
    icon: MessageIcon,
  },
  {
    id: "personal",
    title: "Personal",
    link: "private",
    icon: UserIcon,
  },
  {
    id: "notification",
    title: "Notification",
    link: "notification",
    icon: NotificationIcon,
  },
  {
    id: "communities",
    title: "Communities",
    link: "communities",
    icon: PeopleIcon,
  },
  {
    id: "setting",
    title: "Setting",
    link: "setting",
    icon: SettingsIcon,
  },
]

interface Tab {
  id: string;
  title: string;
  link: string;
  icon: ComponentType | JSX.Element;
}

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<Tab>(sidebarTabs[0])

  const router = useRouter();

  const handleSelectTab = (tab: Tab) => {
    // #NOTE: Update after page development of remaining pages.
    if (tab.id === "chats" || tab.id === "setting") {
      setActiveTab(tab)
      router.push(`/dashboard/${tab.link}`, { scroll: true })
    }
  }

  return (
    <div className="h-full px-3 py-5 flex flex-col gap-4 justify-start relative">
      {
        sidebarTabs?.map(tab => (
          <div
            key={tab.id}
            className={tab.id === "setting" ? "absolute bottom-5" : ""}
            style={{
              justifySelf: tab.id === "setting" ? "flex-end" : ""
            }}
          >
            <ButtonIcon
              key={tab.id}
              icon={tab.icon}
              active={tab.id === activeTab.id}
              onClick={() => handleSelectTab(tab)}
            />
          </div>
        ))
      }
    </div >
  )
}

export default Sidebar;
