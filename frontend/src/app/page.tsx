"use client";
import { useContext, useEffect } from "react"
import { useRouter } from "next/navigation";

import Auth, { AuthContext } from "@/store/auth";
import Home from "./home"
import { getToken } from "@/lib/auth";
import Navbar from "./Navbar";

export default function Page() {

  const { auth, updateAuth } = useContext(AuthContext);
  const router = useRouter();


  useEffect(() => {
    console.log("aa", auth)
    // Read token from localstorage
    if (auth) {
      router.push("/dashboard")
    }

    const token = getToken();

    // default: "h-9 px-24 py-8",
    if (token) {
      // login
      updateAuth(true)
      router.push("/dashboard")
    }
  }, [auth])


  return (
    <Auth>
      <Navbar />
      <Home />
    </Auth>
  );
}
