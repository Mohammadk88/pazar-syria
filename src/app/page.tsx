'use client'

import { HeroSection } from "@/components/sections/HeroSectionModern"
import { CategoriesSection } from "@/components/sections/CategoriesSectionModern"
import { FeaturedAdsSection } from "@/components/sections/FeaturedAdsSectionModern"
import { StatsSection } from "@/components/sections/StatsSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { CTASection } from "@/components/sections/CTASection"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <FeaturedAdsSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}
