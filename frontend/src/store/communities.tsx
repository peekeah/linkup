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
        setState(prev => {
            if (updates.communities) {
                // Check if this is a search/filter operation by looking for searchText in updates
                const isSearchOperation = updates.searchText !== undefined;
                
                if (isSearchOperation) {
                    // For search/filter operations, replace the communities list
                    return { ...prev, ...updates, communities: updates.communities };
                }
                
                // Otherwise, handle joining communities by merging to prevent duplicates
                const existingIds = new Set(prev.communities.map(c => c.id));
                const newCommunities = updates.communities.filter(c => !existingIds.has(c.id));
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