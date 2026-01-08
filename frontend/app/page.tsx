import { HeroSection } from "@/components/landing/HeroSection";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { PricingSection } from "@/components/landing/PricingSection";
import { ResearchFeed } from "@/components/ResearchFeed";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">

      {/* Header */}
      <header className="px-6 lg:px-8 h-16 flex items-center border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">A</div>
          <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Aiper</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6" suppressHydrationWarning>
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors" suppressHydrationWarning>Features</Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors" suppressHydrationWarning>Pricing</Link>
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors" suppressHydrationWarning>Login</Link>
        </nav>
      </header>

      <main className="flex-1">
        <HeroSection />
        <ComparisonSection />

        <div id="features">
          <FeaturesGrid />
        </div>

        {/* Research Feed - Kept as is */}
        <section className="w-full py-24 bg-background border-t border-border/50">
          <ResearchFeed />
        </section>

        <div id="pricing">
          <PricingSection />
        </div>
      </main>

      <footer className="py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2024 Aiper. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
