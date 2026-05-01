"use client"
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconUser } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/store/auth";
import api from "@/services/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Zod schema for form validation
const profileSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.email("Invalid email address"),
  mobile: z.string()
    .regex(/^[0-9]/, "Invalid mobile number")
    .min(10, "Mobile number must be exactly 10 digits")
    .max(10, "Mobile number must be exactly 10 digits")
    .optional(),
  bio: z.string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal("")),
})

type ProfileFormValues = z.infer<typeof profileSchema>

const Setting = () => {
  const { state, updateAuth } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState<string | null>(null)

  // Get token from session like WebSocket does
  const getToken = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      return session?.user?.token || "";
    } catch {
      return "";
    }
  }

  // Initialize react-hook-form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: state.userName || "",
      email: state.email || "",
      mobile: state.mobile || "",
      bio: state.bio || "",
    },
  })

  // Fetch profile data and populate form
  useEffect(() => {
    const fetchProfileData = async () => {
      if (state.userId) {
        try {
          const token = await getToken();
          const res = await api.getProfile(state.userId, token)
          if (res?.data?.status) {
            const profileData = res.data.data
            
            // Update form values with fetched data
            form.reset({
              name: profileData.name || "",
              email: profileData.email || "",
              mobile: profileData.mobile || "",
              bio: profileData.bio || "",
            })
            
            setProfileImage(profileData.image || null)
          }
        } catch (err) {
          toast.error("Error loading profile data")
        }
      }
    }

    fetchProfileData()
  }, [state.userId, form])

  // Handle form submission
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const token = await getToken();
      const res = await api.profile({
        id: state.userId,
        name: values.name,
        email: values.email,
        mobile: values.mobile || "",
        bio: values.bio || "",
      }, token)

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
            <Avatar className="shadow-md m-4 size-32 md:w-48 md:h-48 lg:w-64 lg:h-64 overflow-hidden">
              <AvatarImage src={profileImage || undefined} alt="Profile" className="object-cover" />
              <AvatarFallback>
                <IconUser />
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Form Section */}
          <div className="flex-1 w-full flex items-center">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-lg space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Email" 
                          {...field} 
                          disabled
                          className="bg-muted cursor-not-allowed"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter mobile number" 
                          {...field} 
                          maxLength={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col mt-3 sm:flex-row gap-3">
                  <Button type="submit" className="w-full sm:w-auto">Save</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full sm:w-auto"
                    onClick={() => form.reset()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Setting;
