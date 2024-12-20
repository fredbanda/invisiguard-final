"use client";

import Image from "next/image";

interface CardHeadProps {
    label: string;
}

export const CardHead = ({ label }: CardHeadProps) => {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-y-4">
      <Image
        src="/logo.png"
        alt="Invisiguard Logo"
        width={280}
        height={50}
        className="h-auto w-auto rounded-lg"
      />
      <p className="text-muted-foreground text-[1.2rem]">
       {label} 
      </p>
      </div>
  )
}
