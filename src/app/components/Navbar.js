"use client";
import { useState } from "react";
import useAuthStore from "@/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react"; // simple icons

export default function Navbar() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 flex justify-between items-center shadow-md relative">
      {/* Logo / Title */}
      <Link href={"/"}>
        <span className="font-bold text-lg hover:text-green-100 transition">
          Product Management
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-white text-green-600 font-semibold px-4 py-2 rounded-lg hover:bg-green-100 transition"
        >
          Dashboard
        </button>

        <button
          onClick={() => {
            clearAuth();
            router.push("/login");
          }}
          className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-green-600 text-white flex flex-col items-center space-y-3 py-4 md:hidden shadow-lg">
          <button
            onClick={() => {
              setIsOpen(false);
              router.push("/dashboard");
            }}
            className="w-10/12 bg-white text-green-600 font-semibold px-4 py-2 rounded-lg hover:bg-green-100 transition"
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              clearAuth();
              setIsOpen(false);
              router.push("/login");
            }}
            className="w-10/12 bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
