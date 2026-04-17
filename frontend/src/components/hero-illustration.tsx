import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Separator } from "@radix-ui/react-separator"
import { IconSend, IconUsers } from "@tabler/icons-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export const HeroIllustration = () => {
    return (
        <div className="border p-5 w-2/3 mx-auto rounded-xl bg-accent">
            <div className="flex gap-3 items-center w-full mb-3">
                <Avatar>
                    <AvatarImage><IconUsers /></AvatarImage>
                    <AvatarFallback>DC</AvatarFallback>
                </Avatar>
                <div>
                    <div className="tracking-wider">Design Community</div>
                    <div className="text-xs opacity-70 tracking-wider">12 members online</div>
                </div>
            </div>
            <Separator />
            <div className="space-y-3">
                <div className="flex gap-3">
                    <Avatar>
                        <AvatarImage><IconUsers /> </AvatarImage>
                        <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                    <div className="bg-background p-3 rounded-lg">
                        <div className="text-xs text-gray-300">Sarah</div>
                        <div>Message</div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Avatar>
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="bg-background p-3 rounded-lg">
                        <div className="text-xs text-gray-300">Alex</div>
                        <div>Message</div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <div className="bg-background p-3 rounded-lg">
                        <div className="text-xs text-gray-300">Alex</div>
                        <div>Message</div>
                    </div>
                </div>
            </div>

            <div className="w-full mt-4 relative">
                <Input
                    readOnly
                    className="w-full h-10 rounded-lg! bg-background/30"
                    placeholder={"Type a message"}
                />
                <Button size={"icon"} className="absolute size-7 right-2 inset-y-1/2 transform -translate-y-1/2 rounded-lg">
                    <IconSend className="text-white" size={3} />
                </Button>
            </div>
        </div>
    )
}