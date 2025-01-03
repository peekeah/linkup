import * as React from "react"

import { cn } from "@/lib/utils"
import SearchIcon from "@/assets/SearechIcon.png"
import Image from "next/image"

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
        <button className="absolute top-[10] right-2 bg-primary rounded-full p-[5px]">
          <div className="bg-primary p-1 rounded-full h-6 w-6">
            <Image src={SearchIcon} alt="Search" />
          </div>
        </button>
      </div>
    )
  }
)
Search.displayName = "Search"

export { Search }
