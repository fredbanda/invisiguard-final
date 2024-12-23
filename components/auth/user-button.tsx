"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { GiExitDoor } from "react-icons/gi";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "./logout-button";

export const UserButton = () => {
  const user = useCurrentUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} alt="Avatar" />
          <AvatarFallback className="bg-sky-800">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem className="cursor-pointer hover:bg-red-500 ">
          <GiExitDoor className="mr-2 text-black h-5 w-5" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer hover:bg-red-500 ">
          <GiExitDoor className="mr-2 text-black h-5 w-5" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-red-500 ">
          <GiExitDoor className="mr-2 text-black h-5 w-5" />
          Reports
        </DropdownMenuItem>
        <LogoutButton >
          <DropdownMenuItem className="cursor-pointer hover:bg-red-500 ">
            <GiExitDoor className="mr-2 text-black h-5 w-5" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
