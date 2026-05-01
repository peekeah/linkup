"use client"
import { ChangeEventHandler, SubmitEventHandler, useContext, useState } from "react";

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
      <div className="p-4 md:p-5">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Profile</h1>
      </div>
      <div className="flex-1 items-center p-4 md:p-5 pt-0">
        <div className="flex sm:mt-24 items-center flex-col md:flex-row gap-6 md:gap-8">
          {/* Avatar Section */}
          <div className="flex justify-center md:w-1/3">
            <Avatar className="shadow-md p-4 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64">
              <AvatarImage><IconUser /></AvatarImage>
              <AvatarFallback><IconUser /></AvatarFallback>
            </Avatar>
          </div>
          
          {/* Form Section */}
          <div className="flex-1 w-full flex items-center">
            <form onSubmit={onSubmit} className="w-full max-w-lg space-y-5">
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
              <div className="flex flex-col mt-3 sm:flex-row gap-3">
                <Button type="submit" className="w-full sm:w-auto">Save</Button>
                <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Setting;
