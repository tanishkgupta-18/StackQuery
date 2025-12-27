"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useAuthStore } from "@/store/Auth";
import { useEffect } from "react";
import Header from "./components/Header";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { verfiySession } = useAuthStore();

  useEffect(() => {
    // This checks Appwrite for cookies and logs the user in automatically
    verfiySession();
  }, [verfiySession]);

  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "dark:bg-black dark:text-white")}>
        <Header />
        {children}
      </body>
    </html>
  );
}