"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Hero from "@/assets/hero.png";
import Communities from "@/assets/communities.png";
import MessagingPerson from "@/assets/person-messaging.png";
import Security from "@/assets/security.png";

import { Button } from "@/components/ui/button";
import { IconArrowRight, IconUser, IconUsers } from "@tabler/icons-react";
import { Features } from "@/components/features";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { HeroIllustration } from "@/components/hero-illustration";

const Home = () => {

  const router = useRouter();

  return (
    <div>
      <div className="max-w-[1395px] mx-auto">
        <div className="max-w-[1200px] space-y-12 mx-auto mt-[5%]">

          {/* Hero section */}
          <div className="grid grid-cols-2 justify-between my-42">
            <div className="space-y-7">
              <div className="text-6xl font-bold leading-14">Connect with <br /> <span className="text-primary">like-minded </span>people</div>
              <div className="text-lg opacity-70">Join passionate individuals just like you who are eager to share ideas and learn from one another.</div>
              <div className="space-x-3">
                <Button
                  className="relative px-6 py-3 text-foreground font-semibold rounded-lg 
  border border-primary/60
  shadow-[0_0_8px_color:var(--primary),0_0_16px_color:var(--primary)]
  hover:shadow-[0_0_16px_color:var(--primary),0_0_32px_color:var(--primary)]
  hover:border-primary
  transition-all duration-300"
                  onClick={() => router.push("/login")}
                >
                  <div className="flex gap-1 items-center text-white">Login <IconArrowRight className="text-white" /></div>
                </Button>
                <Button
                  className="w-28"
                  variant="outline"
                  onClick={() => router.push("/signup")}
                >Signup</Button>
              </div>
            </div>
            <div className="">
              <HeroIllustration />
            </div>
          </div>

          <Features />
        </div>

        {/* Footer */}
        <div className="border-t py-5 flex justify-between">
          <div className="flex gap-3 w-full">
            <div className="flex-1">@Linkup {new Date().getFullYear()}</div>
            <div>Terms</div>
            <div>Privacy</div>
          </div>
          <div className="flex gap-3 hidden">
            <div>1.</div>
            <div>2.</div>
            <div>3.</div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Home;
