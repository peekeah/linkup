import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuthContext } from "@/store/auth";
import ProfilePicture from "@/assets/people.svg";
import Image from "next/image";
import React, { ChangeEventHandler, FormEventHandler, useContext, useState } from "react";
import { Separator } from "@/components/ui/separator";

interface InputField {
  label: string;
  value: string;
  name: string;
}

interface InputElement extends InputField {
  type: "Input";
  onChange: ChangeEventHandler<HTMLInputElement>;
}

interface TextareaElement extends InputField {
  type: "Textarea";
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
}

type InputFieldProps = InputElement | TextareaElement;

const InputField: React.FC<InputFieldProps> = (props) => {

  const { type, label, onChange, ...otherProps } = props;

  return (
    <div className="space-y-1 text-semibold text-md">
      <div>{label}</div>
      {
        type === "Input" ?
          <Input
            onChange={onChange}
            {...otherProps}
          /> :
          <Textarea
            className="h-[100px] resize-none"
            onChange={onChange}
            {...otherProps}
          />
      }
    </div>
  )
}

const Profile = () => {
  const { state } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: ""
  })

  console.log("ss:", state)

  const onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    console.log('values', formData)
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
                name="phone"
                label="Phone"
                value={formData.phone}
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
