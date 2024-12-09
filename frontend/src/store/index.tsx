"use client";
import { ReactNode } from "react";
import Auth from "./auth";
import Chat from "./chat";

interface StoreProps {
  children: ReactNode
}

const Store = ({ children }: StoreProps) => {
  return (
    <Auth>
      <Chat>{children}</Chat>
    </Auth>
  )
}

export default Store;
