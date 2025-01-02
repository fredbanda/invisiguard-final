"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react"; // Import useSession hook
import {MoonLoader} from "react-spinners";
import { logout } from "@/actions/logout";

const NavbarMain = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession(); // Add status to track loading
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (status === "loading") {
  
  }

  const onClick = () => {
    logout();
  }

  return (
<header className="flex shadow-md py-3 px-4 sm:px-10 bg-gray-800 text-white font-[sans-serif] min-h-[70px] tracking-wide z-50 sticky top-0">
  <div className="flex flex-wrap items-center justify-between lg:gap-y-4 gap-y-6 gap-x-4 w-full">
    {/* Logo */}
    <Link href="/">
      <Image
        src="/logo.png"
        alt="logo"
        className="w-auto h-auto rounded-md"
        width={100}
        height={50}
      />
    </Link>

    {/* Mobile Menu */}
    <div
      className={`lg:block ${
        isMenuOpen ? "max-lg:block" : "max-lg:hidden"
      } max-lg:fixed max-lg:bg-gray-600 max-lg:mt-16 max-lg:w-2/3 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-4 max-lg:h-2/3 max-lg:shadow-md max-lg:overflow-auto z-50`}
    >
      <ul className="lg:flex lg:gap-x-10 max-lg:space-y-3">
        {[
          { text: "Dashboard", href: "/dashboard" },
          { text: "About Us", href: "/about" },
          { text: "Contact Us", href: "/contact" },
          { text: "Support", href: "/dashboard/support" },
          { text: "Reports", href: "/dashboard/reports" },
          { text: "Account", href: "/dashboard/account" },
          { text: "Places", href: "/dashboard/places" },
        ].map((item, index) => {
          const isActive = pathname === item.href;

          return (
            <li
              key={index}
              className={`max-lg:border-b max-lg:py-3 max-lg:px-3 relative lg:hover:after:absolute lg:after:bg-black lg:after:w-0 lg:hover:after:w-full lg:hover:after:h-[2px] lg:after:block lg:after:top-7 lg:after:transition-all lg:after:duration-300 ${
                isActive ? "text-white underline font-bold" : ""
              }`}
            >
              <Link href={item.href}>{item.text}</Link>
            </li>
          );
        })}
      </ul>
    </div>

    {/* Profile Dropdown or Login/Register */}
    <div className="flex items-center max-sm:ml-auto space-x-6">
      {status === "loading" ? (
        // Show spinner while session is loading
        <div className="flex justify-center items-center min-w-[50px]">
          <MoonLoader color="#fff" size={20} />
        </div>
      ) : session ? (
        // Profile Dropdown
        <div ref={dropdownRef} className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown();
            }}
            className="relative px-1 text-white"
          >
            <Image
              src={session.user?.image || "/user-image.png"}
              alt="User Image"
              width={30}
              height={30}
              className="rounded-full w-auto h-auto"
            />
          </button>
          {isDropdownOpen && (
            <div className="bg-white block z-20 shadow-lg py-6 px-6 rounded sm:min-w-[320px] max-sm:min-w-[250px] absolute right-0 top-10">
              <h6 className="font-semibold text-[15px] text-gray-800 text-center">
                Welcome {session.user?.name || "Guest"}
              </h6>
              <ul className="space-y-1.5">
                {[
                  { text: "Settings", href: "/dashboard/profile" },
                  { text: "User Info", href: "/dashboard/server" },
                  { text: "Reports", href: "/dashboard/reports" },
                  { text: "Supports Tickets", href: "/dashboard/tickets" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-500 hover:text-black"
                    >
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>

                <Button onClick={onClick} className="w-full mt-4 hover:bg-red-600">Logout</Button>

            </div>
          )}
        </div>
      ) : (
        // Login/Register Buttons
        <div className="flex space-x-3">
          <Link href="/auth/login">
            <Button
              variant="custom"
              className="w-full border border-gray-300"
            >
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button
              variant="custom"
              className="w-full border border-gray-300"
            >
              Register
            </Button>
          </Link>
        </div>
      )}
    </div>

    {/* Mobile menu toggle */}
    <button
      onClick={toggleMenu}
      className="lg:hidden ml-7 p-2 rounded"
    >
      {isMenuOpen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
          viewBox="0 0 320.591 320.591"
          fill="#fff"
        >
          <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"></path>
          <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"></path>
        </svg>
      ) : (
        <svg
          className="w-7 h-7"
          fill="#fff"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          ></path>
        </svg>
      )}
    </button>
  </div>
</header>
  );
};

export default NavbarMain;
