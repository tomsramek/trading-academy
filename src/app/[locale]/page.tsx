import { CurriculumSection } from "@/components/home/CurriculumSection";
import { FaqSection } from "@/components/home/FaqSection";
import { Hero } from "@/components/home/Hero";
import { LevelsSection } from "@/components/home/LevelsSection";
import { WhySection } from "@/components/home/WhySection";

export default function Home() {
  return (
    <>
      <Hero />
      <WhySection />
      <LevelsSection />
      <CurriculumSection />
      <FaqSection />
    </>
  );
}
