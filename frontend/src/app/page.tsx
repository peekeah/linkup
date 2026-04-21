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
    const isAuthenticated = getAuthStatus();
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [router, getAuthStatus])

  return (
    <div className="max-w-7xl mx-auto">
      <Navbar />
      <Home />
    </div>
  );
}
