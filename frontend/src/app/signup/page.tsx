"use client";
import { ChangeEvent, FormEvent, useState, useContext } from "react";

import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import FacebookLogo from "@/assets/facebook-logo.svg";
import GoogleLogo from "@/assets/google-logo.svg";
import api from "@/services/api";
import { AuthContext } from "@/store/auth";
import { useRouter } from "next/navigation";

export interface SignupPayload {
  name: string;
  email: string;
  dob: string; // Note: update type to date
  mobile: string;
  password: string;
  confirmPassword: string;
}

type OnInputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

const Signup = () => {

  const router = useRouter();
  const { updateAuth } = useContext(AuthContext);

  const [formData, setFormData] = useState<SignupPayload>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    mobile: ""
  })

  const onChange = (e: OnInputChange) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.signup(formData)
      if (res?.data?.status) {
        updateAuth(true)
        router.push("/dashboard")
      }
    } catch (err) {
      console.log("err", err)
    }
  }

  // Note: Need to add validations

  return (
    <form onSubmit={onSubmit}>
      <div className="flex gap-3 max-w-[1124px] mx-auto h-full w-full">
        <div className="w-1/2 m-5 grid place-items-center">
          <div className="text-3xl text-bold">Logo</div>
        </div>
        <div className="w-1/2 pt-[12%]">
          <div className="flex flex-col gap-7 p-3">
            <div className="text-center uppercase text-3xl">Create Account</div>
            <Input placeholder="Name" value={formData.name} name="name" onChange={onChange} />
            <Input placeholder="Email" value={formData.email} name="email" onChange={onChange} />
            <Input placeholder="Mobile" value={formData.mobile} name="mobile" onChange={onChange} />
            <Input placeholder="Date of Birth" value={formData.dob} name="dob" onChange={onChange} />
            <PasswordInput placeholder="Password" value={formData.password} name="password" onChange={onChange} />
            <PasswordInput placeholder="Confirm Password" value={formData.confirmPassword} name="confirmPassword" onChange={onChange} />
            <div className="text-end text-primary">Forget password</div>

            <div className="flex items-center">
              <div className="flex-grow bg bg-gray-300 h-0.5"></div>
              <div className="flex-grow-0 mx-5 text dark:text-white">Or</div>
              <div className="flex-grow bg bg-gray-300 h-0.5"></div>
            </div>

            <div className="flex gap-10 justify-around w-[80%] mx-auto">
              <div className="flex items-center cursor-pointer rounded-lg hover:bg-primary px-5 py-3">
                <Image width={50} height={50} src={GoogleLogo} alt="Google Logo" />
                <div>Google</div>
              </div>
              <div className="flex items-center gap-3 cursor-pointer rounded-lg hover:bg-primary px-5 py-3">
                <Image width={30} height={30} src={FacebookLogo} alt="Google Logo" />
                <div>Facebook</div>
              </div>
            </div>

            <Button size="lg" type="submit">Submit</Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Signup;
