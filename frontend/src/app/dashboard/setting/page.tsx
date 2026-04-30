"use client"
import { ChangeEventHandler, SubmitEventHandler, useContext, useState } from "react";

import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconUser } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/store/auth";
import api from "@/services/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Setting = () => {

  const { state, updateAuth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: state.userName,
    email: state.email,
    mobile: state.mobile,
    bio: state.bio
  })


  const onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const res = await api.profile({
        id: state.userId,
        ...formData
      })

      if (res?.data?.status) {
        updateAuth({ ...state, ...res?.data?.data })
        toast("Profile updated successfully")
      }

    } catch (err) {
      toast.error("Error while updating profile")
    }
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-5 text-heading font-semibold text-primary">Profile</div>
      <Separator />
      <div className="flex-1 p-5 flex">
        <div className="w-1/3 grid place-content-center">
          <Avatar className="shadow-md p-5 w-[350px] h-[350px]">
            <AvatarImage><IconUser /></AvatarImage>
            <AvatarFallback><IconUser /></AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 text-sm flex items-center">
          <form onSubmit={onSubmit} className="w-2/3 space-y-5">
            <div>
              <Input
                name="name"
                label="Name"
                value={formData.name}
                onChange={onChange}
              />
            </div>
            <div>
              <Input
                name="email"
                label="Email"
                value={formData.email}
                onChange={onChange}
              />
            </div>
            <div>
              <Input
                name="mobile"
                label="Mobile"
                value={formData.mobile}
                onChange={onChange}
              />
            </div>
            <div>
              <Textarea
                name="bio"
                label="Bio"
                className="resize-none"
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

export default Setting;
