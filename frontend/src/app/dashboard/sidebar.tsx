import MessageIcon from "@/assets/message-icon"
import ButtonIcon from "@/components/ui/button-icon";
import SettingsIcon, { SvgProps } from "@/assets/settings"
import NotificationIcon from "@/assets/notification"
import PeopleIcon from "@/assets/people"
import UserIcon from "@/assets/user"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LucideProps } from "lucide-react";
import useAuth from "@/hooks/useAuth";

const sidebarTabs: Tab[] = [
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
    id: "logout",
    title: "Logout",
    link: "logout",
    svg: LogOut
  },
  {
    id: "setting",
    title: "Setting",
    link: "setting",
    icon: SettingsIcon,
  },
]

type Tab = {
  id: string;
  title: string;
  link: string;
} & (
    | {
      icon: React.FC<SvgProps>;
      svg?: never;
    } | {
      icon?: never;
      svg: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >
    }
  )

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<Tab>(sidebarTabs[0])

  const router = useRouter();
  const { handleLogout } = useAuth();

  const handleSelectTab = (tab: Tab) => {
    // #NOTE: Update after page development of remaining pages.
    if (tab.id === "logout") {
      return handleLogout();
    }
    if (tab.id === "chats" || tab.id === "setting") {
      setActiveTab(tab)
      router.push(`/dashboard/${tab.link}`)
    }
  }

  console.log("active", activeTab)

  return (
    <div className="h-full px-3 py-5 flex flex-col gap-4 justify-start relative">
      {
        sidebarTabs?.map(tab => (
          <div
            key={tab.id}
            className={tab.id === "setting" ? "absolute bottom-5" : ""}
          >
            {
              tab.icon ?
                <ButtonIcon
                  icon={tab.icon}
                  active={tab.id === activeTab.id}
                  onClick={() => handleSelectTab(tab)}
                /> :
                <ButtonIcon
                  svg={tab.svg}
                  active={tab.id === activeTab.id}
                  onClick={() => handleSelectTab(tab)}
                />
            }
          </div>
        ))
      }
    </div >
  )
}

export default Sidebar;
