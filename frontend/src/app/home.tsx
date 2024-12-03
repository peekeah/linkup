"use client";
import Image from "next/image";

import Hero from "@/assets/hero.png";
import Communities from "@/assets/communities.png";
import MessagingPerson from "@/assets/person-messaging.png";
import Security from "@/assets/security.png";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Home = () => {

  const router = useRouter();

  return (
    <div className="bg-background">
      <div className="max-w-[1395px] mx-auto">
        <div className="max-w-[1200px] space-y-12 mx-auto mt-[5%]">

          {/* Hero section */}
          <div className="flex justify-between">
            <div className="space-y-7 w-[50%]">
              <div className="text-h1 font-bold leading-[85px]">Connect with like minded people</div>
              <div className="text-[20px]">Join passionate individuals just like you who are eager to share ideas and learn from one another.</div>
              <div className="space-x-3">
                <Button className="rounded-full h-9 px-24 py-8" onClick={() => router.push("/login")}>
                  <div className="text-[20px]">Login</div>
                </Button>
                <Button variant="outline" className="rounded-full h-9 px-24 py-8" onClick={() => router.push("/signup")}>
                  <div className="text-[20px]">Signup</div>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-end mix-blend-multiply">
              <Image src={Hero} alt="hands holding mobile" />
            </div>
          </div>

          {/* Communities section */}
          <div className="flex justify-between items-center">
            <div className="flex mix-blend-multiply">
              <Image src={Communities} alt="people communicating" />
            </div>
            <div className="items-center space-y-7 w-[50%]">
              <div className="text-heading uppercase font-semibold">Connect, Collaborate, Create!</div>
              <div className="text-h2 font-semibold">Join Communities</div>
              <div className="text-body">Connect with vibrant communities, share your thoughts, and brainstorm together. Whether you’re looking to learn, grow, or collaborate, our platform is designed to bring like-minded individuals together.</div>
            </div>
          </div>

          {/* Private chat section */}
          <div className="flex justify-between items-center">
            <div className="items-center space-y-7 w-[50%]">
              <div className="text-heading uppercase font-semibold">Connect Deeply, Share Freely!</div>
              <div className="text-h2 font-semibold">Private Chat</div>
              <div className="text-body">Connect with individuals who resonate with your interests and values. Whether you&apos;re seeking meaningful conversations, sharing ideas, or building friendships, this space allows you to forge connections that matter. Start chatting and discover the joy of connecting with like-minded people!</div>
            </div>
            <div className="flex-1 flex justify-end mix-blend-multiply">
              <Image src={MessagingPerson} alt="person messaging" />
            </div>
          </div>

          {/* Security section */}
          <div className="flex justify-between items-center">
            <div className="flex mix-blend-multiply">
              <Image src={Security} alt="people communicating" />
            </div>
            <div className="items-center space-y-7 w-[50%]">
              <div className="text-heading uppercase font-semibold">Privacy You Can Trust!</div>
              <div className="text-h2 font-semibold">Security</div>
              <div className="text-body">The messages are end to end encrypted ensuring only sender and recipent can read messages. User information is securely stored and never shared with third parties. </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="py-7 flex justify-between">
          <div className="flex gap-3">
            <div>@Linkup 2024</div>
            <div>Terms</div>
            <div>Privacy</div>
          </div>
          <div className="flex gap-3">
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
