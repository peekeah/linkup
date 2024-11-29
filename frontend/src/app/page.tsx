"use client";
import { useContext, useEffect } from "react"
import { useRouter } from "next/navigation";

import Auth, { AuthContext } from "@/store/auth";
import Home from "./home"
import { getToken } from "@/lib/auth";

export default function Page() {

  const { auth } = useContext(AuthContext)
  const router = useRouter();

  useEffect(() => {
    // Read token from localstorage
    if (auth) {
      router.push("/dashboard")
    }

    const token = getToken();

    if (token) {
      // login
    }
  }, [auth, router])


  return (
    <Auth>
      <Home />
    </Auth>
  );
}
