"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ChangeEventHandler, useCallback, useContext, useEffect, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import useSendMessage from "@/hooks/useSendMessage";
import { useDebounce } from "@/hooks/useDebounce";
import { CommunityContext } from "@/store/communities";
import { SupportedOutgoingCommunityMessages } from "@/@types/community";

const categories = ["All", "Technology", "Design", "AI / ML", "Data", "Security", "Career"];

const CommunitiesPage = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearchText = useDebounce(searchInput, 500);

    const sendMessage = useSendMessage();
    const { state, updateSearchText } = useContext(CommunityContext);

    useEffect(() => {
        sendMessage({
            type: SupportedOutgoingCommunityMessages.GetCommunities,
        })
    }, [])

    useEffect(() => {
        updateSearchText(debouncedSearchText);
        sendMessage({
            type: SupportedOutgoingCommunityMessages.Search,
            payload: {
                search: debouncedSearchText,
                category: selectedCategory === "All" ? "" : selectedCategory
            }
        })
    }, [debouncedSearchText, selectedCategory])

    const onSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setSearchInput(e.target.value)
    }

    const handleCategoryChange = useCallback((category: string) => {
        setSelectedCategory(category);
    }, [])

    const getAvatarInitial = (name: string) => name?.charAt(0)?.toUpperCase();

    const totalMembers = state.memberCount > 1000 ? `${(state.memberCount / 1000).toFixed(1)}k` : state.memberCount;

    return (
        <div className="w-full h-full bg-background">
            {/* Header Section */}
            <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border">
                <div className="px-8 py-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-foreground mb-1">Explore Communities</h1>
                        <p className="text-muted-foreground text-sm">
                            Discover your next community • {state.communityCount} communities • {state.memberCount?.toLocaleString() || 0} members active
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-card rounded-lg p-4 border border-border">
                            <div className="text-2xl font-bold text-foreground">{state.communityCount}</div>
                            <div className="text-xs text-muted-foreground mt-1">Communities</div>
                        </div>
                        <div className="bg-card rounded-lg p-4 border border-border">
                            <div className="text-2xl font-bold text-foreground">{totalMembers}</div>
                            <div className="text-xs text-muted-foreground mt-1">members</div>
                        </div>
                        <div className="bg-card rounded-lg p-4 border border-border">
                            <div className="text-2xl font-bold text-foreground">{state.onlineMembers}</div>
                            <div className="text-xs text-muted-foreground mt-1">online now</div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="space-y-4">
                        <div className="relative">
                            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input
                                placeholder="Filter by name or topic..."
                                className="pl-10 bg-card border-border text-foreground placeholder-muted-foreground focus:border-primary"
                                value={searchInput}
                                onChange={onSearchChange}
                            />
                        </div>

                        <div className="flex gap-2 flex-wrap">
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
                    </div>
                </div>
            </div>

            {/* Communities List */}
            <div className="px-8 py-8">
                <div className="space-y-3">
                    {state.communities.length > 0 ? (
                        state.communities.map((community: any) => (
                            <div
                                key={community.id}
                                className="group bg-card border border-border rounded-xl p-5 hover:bg-card/80 hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <Avatar className="w-14 h-14 shrink-0 bg-primary grid place-content-center text-primary-foreground font-bold text-lg">
                                        <AvatarFallback className="bg-primary">
                                            {getAvatarInitial(community?.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Community Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-foreground font-semibold text-sm truncate">{community?.name}</h3>
                                        <p className="text-muted-foreground text-xs mb-3 line-clamp-1">{community?.description || "A community for like-minded people"}</p>
                                        <div className="flex gap-4 text-xs text-muted-foreground">
                                            <span>👥 {community?.members || 0} members</span>
                                            <span>🟢 {community?.onlineMembers || 0} online</span>
                                        </div>
                                    </div>

                                    {/* Join Button */}
                                    <Button className="shrink-0 bg-primary hover:bg-primary/90 text-white">
                                        Join
                                    </Button>
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
    );
};

export default CommunitiesPage;