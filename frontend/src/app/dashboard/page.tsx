import ChatPanel from "./ChatPanel";
import ListPanel from "./ListPanel";
import Sidebar from "./sidebar";
import Topbar from "./Topbar";

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-col bg-white">
      <Topbar />
      <div className="flex w-screen flex-1">
        <Sidebar />
        <ListPanel />
        <div className="flex-1"> <ChatPanel /> </div>
      </div>
    </div>
  )
}

export default Dashboard;
