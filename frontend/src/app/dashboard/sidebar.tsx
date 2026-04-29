import { IconLogout, IconMessage, IconSettings, IconUser, IconUsersGroup } from "@tabler/icons-react"
import { Button } from "@/components/ui/button";
import { useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import { ChatContext } from "@/store/chat";
import { signOut } from "next-auth/react";

const sidebarTabs: Tab[] = [
  {
    id: "chats",
    title: "Chats",
    link: "",
    icon: <IconMessage />,
  },
  {
    id: "people",
    title: "People",
    link: "people",
    icon: <IconUser />,
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
    link: "/",
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
  icon: ReactNode
}

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const [activeTab, setActiveTab] = useState<Tab>(sidebarTabs[0])

  const {clearChatStore} = useContext(ChatContext);

  const router = useRouter();

  const handleSelectTab = (tab: Tab) => {
    if (tab.id === "logout") {
      clearChatStore();
      signOut();
      return;
    }
    // Update active tab for all tabs except logout
    setActiveTab(tab)
    router.push(`/dashboard/${tab.link}`)
    // Close mobile menu if onClose prop is provided
    onClose?.();
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
            className={tab.id === "setting" ? "absolute bottom-5 w-full" : "w-full"}
          >
            <Button
              onClick={() => handleSelectTab(tab)}
              className={clsx(
                "bg-secondary/10 text-primary transition-all cursor-pointer shadow-sm rounded-md hover:bg-primary hover:text-secondary hover:border-primary w-full justify-start",
                tab.id === activeTab.id && "bg-primary text-secondary",
                "md:size-12 md:justify-center md:p-0"
              )}
            >
              <div className="flex items-center gap-3">
                {tab.icon}
                <span className="md:hidden">{tab.title}</span>
              </div>
            </Button>
          </Link>
        ))
      }
    </div >
  )
}

export default Sidebar;
