import ChatPanel from "./ChatPanel";
import ListPanel from "./ListPanel";
import Sidebar from "./sidebar";
import Topbar from "./Topbar";

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-col bg-white font-serif">
      <Topbar />
      <div className="flex w-screen flex-1">
        <Sidebar />
        <div className="w-[450px] h-full">
        <ListPanel />
        </div>
        <div className="flex-1 bg-indigo-300"> <ChatPanel /> </div>
      </div>
    </div>
  )
}

export default Dashboard;
