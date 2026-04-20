import { IconBell, IconLogout, IconMessage, IconSettings, IconUser, IconUsersGroup } from "@tabler/icons-react"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import clsx from "clsx";
import Link from "next/link";

const sidebarTabs: Tab[] = [
  {
    id: "chats",
    title: "Chats",
    link: "",
    icon: <IconMessage />,
  },
  {
    id: "personal",
    title: "Personal",
    link: "private",
    icon: <IconUser />,
  },
  {
    id: "notification",
    title: "Notification",
    link: "notification",
    icon: <IconBell />,
  },
  {
    id: "communities",
    title: "Communities",
    link: "communities",
    icon: <IconUsersGroup />,
  },
  {
    id: "logout",
    title: "Logout",
    link: "logout",
    icon: <IconLogout />,
  },
  {
    id: "setting",
    title: "Setting",
    link: "setting",
    icon: <IconSettings />,
  },
]

type Tab = {
  id: string;
  title: string;
  link: string;
  icon: JSX.Element;
}

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

  return (
    <div className="h-full px-3 py-5 flex flex-col gap-4 justify-start relative">
        <div className="mx-auto text-xl font-bold font-serif">
          <span className="text-primary">Lu</span>
        </div>
      {
        sidebarTabs?.map(tab => (
          <Link
            key={tab.id}
            href={`/dashboard/${tab.link}`}
            className={tab.id === "setting" ? "absolute bottom-5" : ""}
          >
            <Button
              onClick={() => handleSelectTab(tab)}
              className={clsx(
                "bg-secondary/10 text-primary transition-all cursor-pointer shadow-sm rounded-md size-12 hover:bg-primary hover:text-secondary hover:border-primary",
                tab.id === activeTab.id && "bg-primary text-secondary"
              )}
            >
              {tab.icon}
            </Button>
          </Link>
        ))
      }
    </div >
  )
}

export default Sidebar;
