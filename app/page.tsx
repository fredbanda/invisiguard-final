import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-y-10 bg-[radial-gradient(ellipse_at_top,#1b2735_30%,transparent_60%),conic-gradient(from_135deg,#8fd3f4_0%,#6b8df8_50%,#4a74e0_100%)] bg-cover bg-center">
    <Image src="/logo.png" alt="Invisiguard Logo" width={280} height={80} className="h-auto w-auto rounded-lg" />
    <h1 className="text-white text-4xl font-bold text-white/80">Invisiguard</h1>
    <p className="text-white text-xl italic">Protect your data with Invisiguard</p>

    <div className="flex flex-col items-center justify-center">
      <LoginButton>
      <Button variant="custom" size="lg" type="submit" className="w-full">Login</Button>
      </LoginButton>
    </div>
</div>
  );
}
