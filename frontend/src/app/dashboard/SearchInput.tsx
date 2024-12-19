import { Calendar } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useContext, useState } from "react"
import useSendMessage from "@/hooks/useSendMessage"
import { SupportedOutgoingUserMessages } from "@/@types/user"
import { ChatContext } from "@/store/chat"
import { SupportedOutgoingCommunityMessages } from "@/@types/community";
import { AuthContext } from "@/store/auth";


const SearchInput = () => {

  const sendMessage = useSendMessage();
  const [searchText, setSearchText] = useState<string>("");

  const { state, updateSelectedChat } = useContext(ChatContext);
  const { state: authContext } = useContext(AuthContext);

  const { searchContent, chatHistory } = state;

  const isChatJoined = (communityId: string) => {
    return Boolean(chatHistory.find(el => el.communityId === communityId))
  }

  const onChange = async (value: string) => {
    setSearchText(() => value)
    sendMessage({
      type: SupportedOutgoingUserMessages.Search,
      payload: {
        search: value
      }
    });
  }

  const messageChat = (communityId: string) => {
    setSearchText("")
    const selectedChat = state.chatHistory.find(el => el.communityId === communityId);

    if (selectedChat) {
      updateSelectedChat(selectedChat)
    }
  }

  const handleJoin = (communityId: string) => {
    try {
      sendMessage({
        type: SupportedOutgoingCommunityMessages.JoinCommunity,
        payload: {
          userName: authContext.userName,
          roomId: communityId,
        }
      })

      setSearchText("")

    } catch (err) {
      console.log("err while joining community", err)
    }
  }

  return (
    <div className="relative">
      {/* <ButtonIcon svg={MessageCircle} onClick={() => console.log("ell")} /> */}
      <Command className="rounded-lg border shadow-md md:min-w-[450px]">
        <CommandInput
          // value={searchText}
          value={searchText}
          onValueChange={onChange}
          placeholder="Search communites & people"
          className="w-full"
        />
        {
          searchText ?
            <CommandList className="absolute top-full left-0 z-10 max-h-60 w-full overflow-auto rounded-lg border bg-white shadow-lg">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Communities">
                {
                  searchContent?.map(el => (
                    <CommandItem key={el.id} className="flex justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Calendar />
                        <span>{el.name}</span>
                      </div>
                      {
                        isChatJoined(el.id) ?
                          <button onClick={() => messageChat(el.id)}>Message</button> :
                          <button onClick={() => handleJoin(el.id)}>Join</button>
                      }
                      {/* <ButtonIcon svg={MessageCircle} onClick={() => handleJoin(el.id)} /> */}
                    </CommandItem>
                  ))
                }
              </CommandGroup>
              <CommandSeparator />
            </CommandList> :
            <CommandList></CommandList>
        }
      </Command>
    </div >
  )
}

export default SearchInput;
