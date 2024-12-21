import { FeatureOne } from "@/components/page-components/feature-one";
import Hero from "@/components/page-components/hero-section";
import Pricing from "@/components/page-components/Pricing";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-y-10 bg-[radial-gradient(ellipse_at_top,#1b2735_30%,transparent_60%),conic-gradient(from_135deg,#8fd3f4_0%,#6b8df8_50%,#4a74e0_100%)] bg-cover bg-center">
    <Hero />
    <Pricing />
    <FeatureOne />
</div>
  );
}
