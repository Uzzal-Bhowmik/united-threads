"use client";

import Image from "next/image";
import React from "react";
import logo from "/public/logos/logo-normal.svg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import userImg from "/public/images/navbar/user.png";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Shirt } from "lucide-react";
import { History } from "lucide-react";
import { LogOut } from "lucide-react";
import AnimateTextOnHover from "@/components/AnimateTextOnHover/AnimateTextOnHover";
import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import { useRouter } from "next/navigation";
import { MessageCircleMore } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { logout, selectUser } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";
import { MessageSquareText } from "lucide-react";

// Links
const LINKS = [
  {
    key: "home",
    label: "Home",
    route: "/",
  },

  {
    key: "products",
    label: "Products",
    route: "/products",
  },
  {
    key: "shop",
    label: "Shop",
    route: "/shop",
  },
  {
    key: "about",
    label: "About",
    route: "/about",
  },
  {
    key: "contact",
    label: "Contact",
    route: "/contact",
  },
];

export default function Navbar() {
  const userId = useSelector(selectUser)?._id;
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout successful");
    router.push("/");
  };

  return (
    <header className="mb-20 mt-8">
      {/* -------------- Desktop Version ------------- */}
      <div className="mx-auto flex w-3/4 items-center justify-between rounded-2xl bg-lightGray px-4 py-5">
        {/* Left ----- Logo */}
        <Link href="/" className="w-1/4">
          <Image src={logo} alt="Logo" className="mx-auto w-[70%]" />
        </Link>

        {/* Center ------ Links */}
        <div className="flex flex-grow items-center justify-center gap-x-10">
          {LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.route}
              className="font-medium text-primary-black"
            >
              <AnimateTextOnHover path={link.route}>
                {link.label}
              </AnimateTextOnHover>
            </Link>
          ))}
        </div>

        {/* Right -------- User sign up */}
        <div className="flex w-[20%] items-center justify-center">
          {userId ? (
            <div className="flex items-center gap-x-6">
              <Link
                href="/notification"
                className="relative"
                title="notifications"
              >
                <Bell size={24} />
                <Badge className="flex-center absolute -right-2 -top-2 h-5 w-2 rounded-full bg-red-600 text-xs">
                  4
                </Badge>
              </Link>

              <Link href="/chat" className="relative" title="notifications">
                <MessageSquareText size={24} />
                <Badge className="flex-center absolute -right-2 -top-2 h-5 w-2 rounded-full bg-red-600 text-xs">
                  2
                </Badge>
              </Link>

              {/* ---------- User profile --------------- */}
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="border-none outline-none ring-0">
                    <Avatar className="">
                      <AvatarImage src={userImg?.src} />
                      <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="space-y-1 rounded-xl p-2 lg:mr-20">
                    <DropdownMenuItem asChild>
                      <Link href="/user/profile">
                        <User size={20} strokeWidth={1.5} className="mr-2" />
                        Personal Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/user/shop-history">
                        <Shirt size={20} strokeWidth={1.5} className="mr-2" />
                        Shop History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/user/quote-history">
                        <History size={20} strokeWidth={1.5} className="mr-2" />
                        Quote History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut size={20} strokeWidth={1.5} className="mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ) : (
            <Button size="lg" className="primary-button" asChild>
              <Link
                href="/login"
                className="group flex items-center gap-x-1 transition-all duration-200"
              >
                Sign In
                <AnimatedArrow arrowSize={17} />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
