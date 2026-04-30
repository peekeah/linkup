"use client";
import { ReactNode } from "react";
import Auth from "./auth";
import Chat from "./chat";
import Community from "./communities";

interface StoreProps {
  children: ReactNode
}

const Store = ({ children }: StoreProps) => {
  return (
    <Auth>
      <Chat>
        <Community>{children}</Community>
      </Chat>
    </Auth>
  )
}

export default Store;
