import { About } from "@/components/About";
import { Community } from "@/components/Community";
import { DexChart } from "@/components/DexChart";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowToBuy } from "@/components/HowToBuy";
import { LiveStats } from "@/components/LiveStats";
import { MemeGame } from "@/components/MemeGame";
import { Navbar } from "@/components/Navbar";
import { TickerStrip } from "@/components/TickerStrip";
import { Tokenomics } from "@/components/Tokenomics";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MemeGame />
        <TickerStrip />
        <About />
        <Tokenomics />
        <HowToBuy />
        <Community />
        <LiveStats />
        <DexChart />
      </main>
      <Footer />
    </>
  );
}
