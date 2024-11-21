import MessageIcon from "@/assets/message-icon.svg"
import ButtonIcon from "@/components/ui/button-icon";
import SettingsIcon from "@/assets/settings.svg"
import NotificationIcon from "@/assets/notification.svg"
import PeopleIcon from "@/assets/people.svg"
import UserIcon from "@/assets/user.svg"


const Sidebar = () => {
  return (
    <div className="h-full px-3 py-5 flex flex-col justify-between">
      <div className="space-y-3">
        <div><ButtonIcon icon={MessageIcon} active/></div>
        <div><ButtonIcon icon={UserIcon} /></div>
        <div><ButtonIcon icon={NotificationIcon} /></div>
        <div><ButtonIcon icon={PeopleIcon} /></div>
      </div>
      <div>
        <ButtonIcon icon={SettingsIcon}></ButtonIcon>
      </div>
    </div>
  )
}

export default Sidebar;
