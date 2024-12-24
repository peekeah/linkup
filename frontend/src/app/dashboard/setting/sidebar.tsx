"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  title: string;
  description: string;
}

interface Props {
  tabs: Tab[];
  selectedTab: string;
  handleActiveTab: (tabId: string) => void;
}

const Sidebar = (props: Props) => {
  const { tabs, selectedTab, handleActiveTab } = props;

  return (
    <div className="w-[300px]">
      {
        tabs?.map((tab, index) => (

          <div
            key={tab.id}
            className={
              cn(
                "cursor-pointer hover:bg-gray-200",
                selectedTab === tab.id ? "bg-gray-300 hover:bg-gray-300" : ""
              )
            }
            onClick={() => handleActiveTab(tab.id)}
          >
            <div className="p-3">
              <div className="text-lg font-semibold">{tab.title}</div>
              <div className="text-h6 text-[#1E1E1E] opacity-60">{tab.description}</div>
            </div>
            {index !== tabs.length - 1 ? <Separator /> : null}
          </div>

        ))
      }
    </div>
  )
}

export default Sidebar;
