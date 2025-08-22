"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./components/Navbar";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const router = useRouter();

 const { token, hydrated } = useAuthStore();

useEffect(() => {
  if (!hydrated) return; // 👈 wait until Zustand has loaded localStorage

  if (!token && pathname !== "/login" && pathname !== "/register") {
    router.push("/login");
  }
}, [token, hydrated, pathname, router]);


  return (
    <QueryClientProvider client={queryClient}>
      {token && <Navbar />}
      <main className="p-4">{children}</main>
      <ToastContainer position="top-right" autoClose={2000} />
    </QueryClientProvider>
  );
}
