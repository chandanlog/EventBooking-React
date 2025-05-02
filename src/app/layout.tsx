// app/layout.tsx

"use client";

import { useState, useEffect } from "react";
import { CssBaseline } from "@mui/material";
import Header from "./components/Header"; // Adjust import path as necessary
import Footer from "./components/Footer"; // Adjust import path as necessary
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status from localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // If we are on the dashboard, don't show the header/footer
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdminDashboard = pathname.startsWith("/adminDashboard");

  // Redirect to home page if no valid route found
  useEffect(() => {
    if (pathname === "/") {
      router.push("/");
    }
  }, [pathname, router]);

  return (
    <html lang="en">
      <body>
        <CssBaseline />
        {!isDashboard && !isAdminDashboard && <Header />}
        <main>{children}</main>
        {!isDashboard && !isAdminDashboard  && <Footer />}
      </body>
    </html>
  );
}
