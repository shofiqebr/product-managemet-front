"use client";
import { useState } from "react";
import useAuthStore from "@/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react"; 
import logo from "@/assets/logo.png";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const { clearAuth, user } = useAuthStore();
  // console.log(user, "user")
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-500 text-white px-3 md:px-6 md:pr-8 py-4 flex justify-between items-center shadow-md relative">
      {/* Logo / Title */}
      <Link href={"/"}>
        <Image src={logo} alt="logo" height={40} />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        {user && (
          <>
            <span className="font-semibold"> {user}</span>
            <Link
              href="/repairs"
              className="bg-white text-green-600 font-semibold px-4 py-2 rounded-lg hover:bg-green-100 transition"
            >
              All Repairs
            </Link>
          </>
        )}

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
          {user && (
            <>
              <span className="font-semibold"> {user}</span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/repairs");
                }}
                className="w-10/12 bg-white text-green-600 font-semibold px-4 py-2 rounded-lg hover:bg-green-100 transition"
              >
                All Repairs
              </button>
            </>
          )}

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
