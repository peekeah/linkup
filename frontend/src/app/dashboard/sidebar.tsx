import { IconLogout, IconMessage, IconSettings, IconUser, IconUsersGroup, IconX } from "@tabler/icons-react"
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
    <div className="h-full px-4 py-6 flex flex-col relative">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-8">
            <div className="mx-auto text-xl font-bold font-serif">
              <span className="text-primary">Lu</span>
            </div>
            {onClose && (
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onClose} 
                    className="md:hidden hover:bg-secondary/20"
                >
                    <IconX className="w-5 h-5" />
                </Button>
            )}
        </div>
        
        {/* Navigation tabs */}
        <div className="flex flex-col gap-3 flex-grow">
        {
          sidebarTabs?.map(tab => (
            <Link
              key={tab.id}
              href={`/dashboard/${tab.link}`}
              className={tab.id === "setting" ? "mt-auto" : ""}
            >
              <Button
                onClick={() => handleSelectTab(tab)}
                className={clsx(
                  "w-full justify-start h-12 px-4 transition-all duration-200 rounded-lg",
                  "bg-secondary/10 text-primary hover:bg-primary hover:text-secondary",
                  "shadow-sm hover:shadow-md border border-transparent hover:border-primary/20",
                  tab.id === activeTab.id && "bg-primary text-secondary shadow-md border-primary/30",
                  "md:size-12 md:justify-center md:p-0"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium md:hidden">{tab.title}</span>
                </div>
              </Button>
            </Link>
          ))
        }
        </div>
    </div >
  )
}

export default Sidebar;
