"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ChangeEventHandler, useCallback, useContext, useEffect, useState } from "react";
import { IconSearch, IconCheck, IconPlus } from "@tabler/icons-react";
import useSendMessage from "@/hooks/useSendMessage";
import { useDebounce } from "@/hooks/useDebounce";
import { CommunityContext } from "@/store/communities";
import { ChatContext } from "@/store/chat";
import { SupportedOutgoingCommunityMessages } from "@/@types/community";
import { SupportedOutgoingUserMessages } from "@/@types/user";

const categories = [
  "All",
  "Technology",
  "Design",
  "Business",
  "Career",
  "Education",
  "Health & Fitness",
  "Entertainment",
  "Travel & Lifestyle",
  "Creative Arts",
  "Social & Community"
];

type CommunityCard = {
    id: string;
    name: string;
    description?: string;
    members?: number;
    onlineMembers?: number;
};

const CommunitiesPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearchText = useDebounce(searchInput, 500);

    const sendMessage = useSendMessage();
    const { state } = useContext(CommunityContext);
    const { state: chatState } = useContext(ChatContext);

    // Check if user has already joined a community
    const isJoined = useCallback((communityId: string) => {
        return chatState.chatHistory.some(chat => "communityId" in chat && chat.communityId === communityId);
    }, [chatState.chatHistory]);

    useEffect(() => {
        sendMessage({
            type: SupportedOutgoingCommunityMessages.GetCommunities,
        })
    }, [sendMessage])

    useEffect(() => {
        setSearchInput(debouncedSearchText);
        sendMessage({
            type: SupportedOutgoingCommunityMessages.SearchCommunity,
            payload: {
                search: debouncedSearchText,
                category: selectedCategory === "All" ? "" : selectedCategory
            }
        })
    }, [debouncedSearchText, selectedCategory, sendMessage])

    const onSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setSearchInput(e.target.value)
    }

    const handleCategoryChange = useCallback((category: string) => {
        setSelectedCategory(category);
    }, [])

    const handleJoinCommunity = (roomId: string) => {
        sendMessage({
            type: SupportedOutgoingCommunityMessages.JoinCommunity,
            payload: { roomId }
        });
        sendMessage({
            type: SupportedOutgoingUserMessages.ChatHistory
        });
    }

    const getAvatarInitial = (name: string) => name?.charAt(0)?.toUpperCase();

    const totalMembers = state.memberCount > 1000 ? `${(state.memberCount / 1000).toFixed(1)}k` : state.memberCount;

    return (
        <div className="w-full h-full bg-background flex flex-col">
            {/* Header Section */}
            <div className="flex-shrink-0 sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border">
                <div className="px-4 py-4 md:px-6 md:py-6">
                        <div className="mb-2 md:mb-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Explore Communities</h1>
                        <p className="text-muted-foreground text-xs">
                            Discover your next community - {state.communityCount} communities - {state.memberCount?.toLocaleString() || 0} members active
                        </p>
                    </div>

                    {/* Stats Cards - Desktop */}
                    <div className="hidden sm:grid sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                        <div className="bg-card rounded-lg p-3 md:p-4 border border-border">
                            <div className="text-2xl font-bold text-foreground">{state.communityCount}</div>
                            <div className="text-xs text-muted-foreground mt-1">Communities</div>
                        </div>
                        <div className="bg-card rounded-lg p-3 md:p-4 border border-border">
                            <div className="text-2xl font-bold text-foreground">{totalMembers}</div>
                            <div className="text-xs text-muted-foreground mt-1">members</div>
                        </div>
                        <div className="bg-card rounded-lg p-3 md:p-4 border border-border">
                            <div className="text-2xl font-bold text-foreground">{state.onlineMembers}</div>
                            <div className="text-xs text-muted-foreground mt-1">online now</div>
                        </div>
                    </div>
                    
                    {/* Mobile Compact Stats */}
                    <div className="sm:hidden flex items-center justify-between gap-2 mb-3 px-1">
                        <div className="text-center flex-1">
                            <div className="text-lg font-bold text-foreground">{state.communityCount}</div>
                            <div className="text-xs text-muted-foreground">Communities</div>
                        </div>
                        <div className="text-center flex-1">
                            <div className="text-lg font-bold text-foreground">{totalMembers}</div>
                            <div className="text-xs text-muted-foreground">members</div>
                        </div>
                        <div className="text-center flex-1">
                            <div className="text-lg font-bold text-foreground">{state.onlineMembers}</div>
                            <div className="text-xs text-muted-foreground">online</div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="space-y-3 md:space-y-4">
                        <div className="relative">
                            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input
                                placeholder="Filter by name or topic..."
                                className="pl-10 bg-card border-border text-foreground placeholder-muted-foreground focus:border-primary"
                                value={searchInput}
                                onChange={onSearchChange}
                            />
                        </div>

                        {/* Desktop Filter Categories */}
                        <div className="hidden md:flex gap-1.5 flex-wrap">
                            {categories.map((category) => (
                                <Badge
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    className={`cursor-pointer py-1.5 px-3 text-xs transition-all ${selectedCategory === category
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-card border-border text-muted-foreground hover:border-primary hover:text-foreground"
                                        }`}
                                    onClick={() => handleCategoryChange(category)}
                                >
                                    {category}
                                </Badge>
                            ))}
                        </div>
                        
                        {/* Mobile Category Dropdown */}
                        <div className="md:hidden">
                            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                                <SelectTrigger className="w-full bg-card border-border text-foreground">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                    {categories.map((category) => (
                                        <SelectItem 
                                            key={category} 
                                            value={category}
                                            className="text-foreground hover:bg-accent focus:bg-accent cursor-pointer"
                                        >
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Communities List - Scrollable Container */}
            <div className="flex-1 chat-scroll overflow-y-auto">
                <div className="px-4 py-4 md:px-8 md:py-8">
                    <div className="space-y-2 md:space-y-3">
                        {state.communities.length > 0 ? (
                            state.communities.map((community: CommunityCard) => (
                                <div
                                    key={community.id}
                                    className="group bg-card border border-border rounded-xl p-3 md:p-5 hover:bg-card/80 hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <Avatar className="w-12 h-12 shrink-0 bg-primary grid place-content-center text-primary-foreground font-bold text-lg">
                                            <AvatarFallback className="bg-primary">
                                                {getAvatarInitial(community?.name)}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Community Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-foreground font-semibold text-sm truncate">{community?.name}</h3>
                                            <p className="text-muted-foreground text-xs mb-0.5 line-clamp-1">{community?.description || "A community for like-minded people"}</p>
                                            <div className="flex gap-4 text-xs text-muted-foreground">
                                            </div>
                                        </div>

                                        {/* Join Button */}
                                        {isJoined(community?.id ?? "") ? (
                                            <Button
                                                size="icon"
                                                className="bg-green-400 shrink-0 cursor-not-allowed md:size-auto md:px-4 md:py-2"
                                            >
                                                <IconCheck />
                                                <span className="hidden md:block">Joined</span>
                                            </Button>
                                        ) : (
                                            <Button
                                                size="icon"
                                                className="shrink-0 bg-primary hover:bg-primary/90 text-white md:size-auto md:px-4 md:py-2"
                                                onClick={() => handleJoinCommunity(community?.id ?? "")}
                                            >
                                                <IconPlus />
                                                <span className="hidden md:block">Join</span>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground text-sm">No communities found matching your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunitiesPage;