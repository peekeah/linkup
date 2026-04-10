import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { IconSearch } from "@tabler/icons-react"

const Search = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <div
        className={
          cn("flex relative items-center", className)
        }
      >
        <input
          type={type}
          className={
            cn(
              "flex h-full w-full rounded-full border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              className
            )
          }
          ref={ref}
          {...props}
        />
        <Button className="absolute top-[10] right-2 bg-primary rounded-full p-[5px] size-8">
          <IconSearch />
        </Button>
      </div>
    )
  }
)
Search.displayName = "Search"

export { Search }
