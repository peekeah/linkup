import { Separator } from "@/components/ui/separator";
import ChatPanel from "./ChatPanel";
import ListPanel from "./ListPanel";
import Sidebar from "./sidebar";
import Topbar from "./Topbar";

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-col bg-white font-serif">
      <Topbar />
      <Separator />
      <div className="flex w-screen flex-1">
        <Sidebar />
        <Separator orientation="vertical" />
        <div className="w-[450px] h-full"><ListPanel /></div>
        <Separator orientation="vertical" />
        <div className="flex-1"><ChatPanel /> </div>
      </div>
    </div>
  )
}

export default Dashboard;
