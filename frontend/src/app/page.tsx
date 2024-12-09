"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Home from "./home"
import Navbar from "./Navbar";
import useAuth from "@/hooks/useAuth";

export default function Page() {

  const router = useRouter();
  const { getAuthStatus } = useAuth();

  useEffect(() => {
    const authStatus = getAuthStatus();
    if (authStatus) {
      router.push("/dashboard")
    }
  }, [])

  return (
    <>
      <Navbar />
      <Home />
    </>
  );
}
