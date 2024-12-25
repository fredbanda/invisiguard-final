"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const DashboardNav = () => {
  const pathname = usePathname();
  return (
    <nav className="bg-slate-200 flex justify-between items-center p-4 rounded-xl w-[640px] shadow-sm mt-12">
      <div className="flex gap-x-2">
        <Button
          asChild
          variant={pathname === "/dashboard/settings" ? "default" : "outline"}
        >
          <Link href="/dashboard/settings">Profile Info</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/dashboard/server" ? "default" : "outline"}
        >
          <Link href="/dashboard/server">Server</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/dashboard/client" ? "default" : "outline"}
        >
          <Link href="/dashboard/client">Client</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/dashboard/admin" ? "default" : "outline"}
        >
          <Link href="/dashboard/admin">Admin</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/dashboard/profile" ? "default" : "outline"}
        >
          <Link href="/dashboard/profile">Profile Settings</Link>
        </Button>
      </div>
      <UserButton />
    </nav>
  );
};
