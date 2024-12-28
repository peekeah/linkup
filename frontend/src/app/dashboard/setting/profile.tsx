import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/store/auth";
import ProfilePicture from "@/assets/people.svg";
import Image from "next/image";
import React, {
  ChangeEventHandler,
  FormEventHandler,
  useContext,
  useState
} from "react";
import { Separator } from "@/components/ui/separator";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import InputField from "./InputField";

const Profile = () => {

  const { state, updateAuth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: state.userName,
    email: state.email,
    mobile: state.mobile,
    bio: state.bio
  })

  const { toast } = useToast();

  const onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await api.profile({
        id: state.userId,
        ...formData
      })

      if (res?.data?.status) {
        updateAuth({ ...state, ...res?.data?.data })
        toast({
          title: "Success",
          description: "Profile updated successfully"
        })
      }

    } catch (err) {
      console.log("error while updating profile", err)
      toast({
        variant: "destructive",
        title: "Failure",
        description: "Error while updating profile"
      })
    }
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-5 text-heading font-semibold text-primary">Profile</div>
      <Separator />
      <div className="flex-1 p-5 flex">
        <div className="w-1/3 grid place-content-center">
          <Avatar className="shadow-md p-5 w-[350px] h-[350px]">
            <Image
              height={350}
              width={350}
              src={ProfilePicture}
              alt="Profile pic"
            />
          </Avatar>
        </div>
        <div className="flex-1 text-sm flex items-center">
          <form onSubmit={onSubmit} className="w-2/3 space-y-5">
            <div>
              <InputField
                type="Input"
                name="name"
                label="Name"
                value={formData.name}
                onChange={onChange}
              />
            </div>
            <div>
              <InputField
                type="Input"
                name="email"
                label="Email"
                value={formData.email}
                onChange={onChange}
              />
            </div>
            <div>
              <InputField
                type="Input"
                name="mobile"
                label="Mobile"
                value={formData.mobile}
                onChange={onChange}
              />
            </div>
            <div>
              <InputField
                type="Textarea"
                name="bio"
                label="Bio"
                value={formData.bio}
                onChange={onChange}
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit">Save</Button>
              <Button>Cancel</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile;
