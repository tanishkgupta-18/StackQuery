"use client";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session, hydrated } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    // Only redirect if we have checked the session (hydrated) and it exists
    if (hydrated && session) {
      router.push("/");
    }
  }, [session, hydrated, router]);


  if (!hydrated) {
    return null; 
  }

  if (session) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
      <BackgroundBeams />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Layout;