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

const SearchInput = () => {

  const sendMessage = useSendMessage();
  const [searchText, setSearchText] = useState<string>("");

  const { state } = useContext(ChatContext);
  const { searchContent } = state;

  const onChange = async (value: string) => {
    setSearchText(() => value)
    sendMessage({
      type: SupportedOutgoingUserMessages.Search,
      payload: {
        search: value
      }
    });
  }

  const handleJoin = (communityId: string) => {
    console.log("join", communityId)
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
                      <button onClick={() => handleJoin(el.id)}>Join</button>
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
