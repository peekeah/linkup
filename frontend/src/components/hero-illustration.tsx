import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { IconSend, IconUsers } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const HeroIllustration = () => {
  return (
    <div className="relative">
      {/* Glow Halo */}
      <div className="absolute inset-0 bg-primary/10 rounded-xl blur-xl -z-10"></div>
      <div className="border border-primary/20 p-4 sm:p-6 w-full max-w-md mx-auto rounded-xl bg-accent/50 backdrop-blur-sm shadow-xl">
      {/* Community Header */}
      <div className="flex gap-3 items-center w-full mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage>
            <IconUsers className="h-6 w-6" />
          </AvatarImage>
          <AvatarFallback>DC</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-semibold tracking-wide">Design Community</div>
          <div className="text-xs text-muted-foreground tracking-wide">12 members online</div>
        </div>
      </div>
      
      <Separator className="mb-4" />
      
      {/* Chat Messages */}
      <div className="space-y-3 mb-4">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage>
              <IconUsers className="h-4 w-4" />
            </AvatarImage>
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <div className="bg-background p-3 rounded-lg max-w-[80%]">
            <div className="text-xs text-muted-foreground mb-1">Sarah</div>
            <div className="text-sm">Hey everyone! Excited to be part of this community!</div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="bg-background p-3 rounded-lg max-w-[80%]">
            <div className="text-xs text-muted-foreground mb-1">Alex</div>
            <div className="text-sm">Welcome Sarah! Great to have you here.</div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%]">
            <div className="text-xs opacity-70 mb-1">You</div>
            <div className="text-sm">Thanks! Looking forward to collaborating</div>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="w-full relative">
        <Input
          readOnly
          className="w-full h-10 rounded-lg bg-background/30 pr-12"
          placeholder="Type a message..."
        />
        <Button 
          size="icon" 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-lg"
          disabled
        >
          <IconSend className="h-3 w-3" />
        </Button>
      </div>
      </div>
    </div>
  );
};