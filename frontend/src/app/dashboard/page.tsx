import ChatPanel from "./ChatPanel";
import ListPanel from "./ListPanel";
import Sidebar from "./sidebar";
import Topbar from "./Topbar";

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-col bg-white">
      <Topbar />
      <div className="flex w-screen bg-blue-300 flex-1">
        <Sidebar />
        <ListPanel />
        <ChatPanel />
      </div>
    </div>
  )
}

export default Dashboard;
