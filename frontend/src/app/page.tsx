"use client";

import Home from "./home";
import Navbar from "./Navbar";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Home />
      </main>
    </div>
  );
}
