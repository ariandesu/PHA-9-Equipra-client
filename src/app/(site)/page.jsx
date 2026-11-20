import Hero from "@/components/home/hero";
import Showcase from "@/components/home/showcase";
import LogoCloud from "@/components/home/logo-cloud";
import Stats from "@/components/home/stats";
import Featured from "@/components/home/featured";
import Marquee3D from "@/components/home/marquee-3d";
import FocusCards from "@/components/home/focus-cards";
import Timeline from "@/components/home/timeline";
import BentoGrid from "@/components/home/bento-grid";
import Reviews from "@/components/home/reviews";
import FAQ from "@/components/home/faq";
import OwnerCTA from "@/components/home/owner-cta";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-x-clip">
      <Hero />
      <Showcase />
      <LogoCloud />
      <Stats />
      <Featured />
      <Marquee3D />
      <FocusCards />
      <Timeline />
      <BentoGrid />
      <Reviews />
      <FAQ />
      <OwnerCTA />
    </div>
  );
}
