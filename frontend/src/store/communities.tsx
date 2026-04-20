"use client"
import { createContext, ReactNode, useState } from "react";

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
    selectedCategory: "all"
}

export const CommunityContext = createContext<CommunityContext>({
    state: {
        ...initialState
    },
    updateCommunities: (state: Partial<State>) => { },
    updateSearchText: (text: string) => { },
});


const Community = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<State>(initialState)

    const updateCommunities = (state: Partial<State>) => {
        setState(prev => ({ ...prev, ...state }))
    }

    const updateSearchText = (text: string) => {
        setState(prev => ({ ...prev, ["searchText"]: text }))
    }

    return (
        <CommunityContext.Provider value={{
            state,
            updateCommunities,
            updateSearchText
        }}>{children}</CommunityContext.Provider>
    )
}

export default Community;