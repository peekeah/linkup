"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarFallback as RadixAvatarFallback } from "@radix-ui/react-avatar";
import { ChangeEventHandler, useCallback, useContext, useEffect, useState } from "react";
import { IconSearch, IconMessage } from "@tabler/icons-react";
import useSendMessage from "@/hooks/useSendMessage";
import { useDebounce } from "@/hooks/useDebounce";
import { ChatContext, User, PrivateChatHistory } from "@/store/chat";
import { SupportedChatMessages } from "@/@types/chat";
import { SupportedOutgoingUserMessages } from "@/@types/user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const PeoplePage = () => {
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearchText = useDebounce(searchInput, 500);
    const [loading, setLoading] = useState(false);

    const sendMessage = useSendMessage();
    const router = useRouter();
    const { state, updateSelectedChat, updatePrivateChats } = useContext(ChatContext);
    const { privateChats, searchResults } = state;


    // Check if user already has a private chat
    const hasPrivateChat = useCallback((userId: string) => {
        return privateChats.some(chat => chat.recipientId === userId);
    }, [privateChats]);

    useEffect(() => {
        // Load initial users
        setLoading(true);
        sendMessage({
            type: SupportedOutgoingUserMessages.Search,
            payload: { search: "" }
        });
        setLoading(false);
    }, []);

    useEffect(() => {
        // Search users when debounced text changes
        if (debouncedSearchText !== undefined) {
            setLoading(true);
            sendMessage({
                type: SupportedOutgoingUserMessages.Search,
                payload: { search: debouncedSearchText }
            });
            // Reset loading after a delay to allow for response
            setTimeout(() => setLoading(false), 300);
        }
    }, [debouncedSearchText]);

    const onSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setSearchInput(e.target.value)
    }

    const handleMessageUser = (user: User) => {
        // Create or navigate to private chat
        const existingChat = privateChats.find(chat => chat.recipientId === user.id);
        
        if (existingChat) {
            // Navigate to existing chat
            updateSelectedChat(existingChat);
        } else {
            // Create new private chat
            const newPrivateChat: PrivateChatHistory = {
                id: `private-${user.id}`,
                content: "",
                recipientId: user.id,
                recipientName: user.name,
                date: new Date().toISOString(),
                recipient: user,
                message: "Start a conversation",
                type: 'private',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Add to private chats and select it
            updatePrivateChats([...privateChats, newPrivateChat]);
            updateSelectedChat(newPrivateChat);
            
            toast("Private Chat", {
                description: `Started conversation with ${user.name}`
            });
        }

        // Navigate to the chats page with parameters to select the private chat
        router.push(`/dashboard?tab=people&chat=${user.id}`);
    }

    const getAvatarInitial = (name: string) => name?.charAt(0)?.toUpperCase();

    return (
        <div className="w-full h-full bg-background">
            {/* Header Section */}
            <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border">
                <div className="px-8 py-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-foreground mb-1">Discover People</h1>
                        <p className="text-muted-foreground text-sm">
                            Find and connect with people in the community • {searchResults.length} users found
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                            placeholder="Search by name, email, or bio..."
                            className="pl-10 bg-card border-border text-foreground placeholder-muted-foreground focus:border-primary"
                            value={searchInput}
                            onChange={onSearchChange}
                        />
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="px-8 py-8">
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-sm">Loading users...</p>
                        </div>
                    ) : searchResults.length > 0 ? (
                        searchResults.map((user: User) => (
                            <div
                                key={user.id}
                                className="group bg-card border border-border rounded-xl p-5 hover:bg-card/80 hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <Avatar className="w-14 h-14 shrink-0 bg-primary grid place-content-center text-primary-foreground font-bold text-lg">
                                        <AvatarImage src={user.image} />
                                        <RadixAvatarFallback className="bg-primary">
                                            {getAvatarInitial(user?.name)}
                                        </RadixAvatarFallback>
                                    </Avatar>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-foreground font-semibold text-sm truncate">{user?.name}</h3>
                                        <p className="text-muted-foreground text-xs mb-2 line-clamp-1">{user.email}</p>
                                        <p className="text-muted-foreground text-xs line-clamp-2">{user.bio || "No bio available"}</p>
                                    </div>

                                    {/* Message Button */}
                                    <Button
                                        className="shrink-0 bg-primary hover:bg-primary/90 text-white"
                                        onClick={() => handleMessageUser(user)}
                                    >
                                        {hasPrivateChat(user.id) ? (
                                            <>
                                                <IconMessage className="w-4 h-4 mr-2" />
                                                Chat
                                            </>
                                        ) : (
                                            <>
                                                <IconMessage className="w-4 h-4 mr-2" />
                                                Message
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-sm">No users found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PeoplePage;
