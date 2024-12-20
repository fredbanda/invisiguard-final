import { Button } from "@/components/ui/button"
import Link from "next/link"

const NotFound = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-y-10 bg-[radial-gradient(ellipse_at_top,#1b2735_30%,transparent_60%),conic-gradient(from_135deg,#8fd3f4_0%,#6b8df8_50%,#4a74e0_100%)] bg-cover bg-center">
    <h1 className="text-white text-4xl font-bold text-white/80">
        Sorry but the page you are looking for does not exist.
    </h1>
    <Link href="/">
    <Button variant="custom" size="lg" type="submit" className="w-full">Go Back Home</Button>
    </Link>
</div>
  )
}

export default NotFound