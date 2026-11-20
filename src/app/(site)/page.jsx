import Hero from "@/components/home/hero";
import Showcase from "@/components/home/showcase";
import LogoCloud from "@/components/home/logo-cloud";
import Stats from "@/components/home/stats";
import Featured from "@/components/home/featured";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Showcase />
      <LogoCloud />
      <Stats />
      <Featured />
    </div>
  );
}
