import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useState } from "react"

const SearchInput = () => {

  const [searchText, setSearchText] = useState<string>("");

  const onChange = (value: string) => {
    console.log("valuee", value, typeof value)
    setSearchText(() => value)
  }

  return (
    <div className="relative">
      <Command className="rounded-lg border shadow-md md:min-w-[450px]">
        <CommandInput
          value={searchText}
          onValueChange={onChange}
          placeholder="Search communites & people"
          className="w-full"
        />
        {
          searchText ?
            <CommandList className="absolute top-full left-0 z-10 max-h-60 w-full overflow-auto rounded-lg border bg-white shadow-lg">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <Calendar />
                  <span>Calendar</span>
                </CommandItem>
                <CommandItem>
                  <Smile />
                  <span>Search Emoji</span>
                </CommandItem>
                <CommandItem disabled>
                  <Calculator />
                  <span>Calculator</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem>
                  <User />
                  <span>Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <CreditCard />
                  <span>Billing</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Settings />
                  <span>Settings</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList> :
            <CommandList></CommandList>
        }
      </Command>
    </div >
  )
}

export default SearchInput;
