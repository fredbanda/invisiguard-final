"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const DashboardNav = () => {
  const pathname = usePathname();
  return (
    <nav className="bg-slate-200 flex justify-between items-center p-4 rounded-xl w-[860px] shadow-sm mt-12">
      <div className="flex gap-x-2">
        <Button
          asChild
          variant={pathname === "/dashboard/maxmind-report" ? "default" : "outline"}
        >
          <Link href="/dashboard/maxmind-report">Reports</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/dashboard/pen-test" ? "default" : "outline"}
        >
          <Link href="/dashboard/pen-test">Pen Test</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/dashboard/ipqs-checker" ? "default" : "outline"}
        >
          <Link href="/dashboard/ipqs-checker">IPQS Checker</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/dashboard/scam-scan" ? "default" : "outline"}
        >
          <Link href="/dashboard/scam-scan">Scam Scanner</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/dashboard/maxmind-query-form" ? "default" : "outline"}
        >
          <Link href="/dashboard/maxmind-query-form">MinMax Report</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/dashboard/fingerprint" ? "default" : "outline"}
        >
          <Link href="/dashboard/fingerprint">Fingerprint</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/dashboard/profile" ? "default" : "outline"}
        >
          <Link href="/dashboard/profile">Profile Settings</Link>
        </Button>
      </div>
    </nav>
  );
};
