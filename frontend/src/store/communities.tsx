"use client"
import { createContext, ReactNode, useCallback, useState } from "react";

type Community = {
    id: string;
    name: string;
    ownerId: string;
}

type State = {
    communities: Community[];
    tags: string[];
    searchText: string;
    memberCount: number;
    onlineMembers: number;
    communityCount: number;
    selectedCategory: string;
    categories: string[];
}


type CommunityContext = {
    state: State
    updateCommunities: (state: Partial<State>) => void,
    updateSearchText: (text: string) => void,
}

const initialState = {
    communities: [],
    tags: [],
    searchText: "",
    memberCount: 0,
    onlineMembers: 0,
    communityCount: 0,
    selectedCategory: "all",
    categories: []
}

export const CommunityContext = createContext<CommunityContext>({
    state: {
        ...initialState
    },
    updateCommunities: () => { },
    updateSearchText: () => { },
});


const Community = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<State>(initialState)

    const updateCommunities = useCallback((updates: Partial<State>) => {
        setState((prev) => {
            if (updates.communities) {
                // Always replace when there's explicit search or category filter (presence check, not truthiness)
                if (updates.searchText !== undefined || updates.selectedCategory !== undefined) {
                    return { ...prev, ...updates, communities: updates?.communities ?? [] };
                }
                
                // For initial load and incremental updates, merge to avoid race conditions
                // but ensure we don't duplicate existing communities
                const existingIds = new Set(prev.communities.map(c => c.id));
                const newCommunities = updates?.communities.filter(c => !existingIds.has(c.id));
                const mergedCommunities = [...prev.communities, ...newCommunities];
                return { ...prev, ...updates, communities: mergedCommunities };
            }
            return { ...prev, ...updates };
        })
    }, [])

    const updateSearchText = useCallback((text: string) => {
        setState(prev => ({ ...prev, searchText: text }))
    }, [])

    return (
        <CommunityContext.Provider value={{
            state,
            updateCommunities,
            updateSearchText
        }}>{children}</CommunityContext.Provider>
    )
}

export default Community;