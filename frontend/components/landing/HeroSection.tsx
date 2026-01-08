import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative w-full pt-32 pb-24 md:pt-48 md:pb-32 flex flex-col items-center text-center px-4 overflow-hidden">

            {/* Ambient Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none mix-blend-screen animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none mix-blend-screen" />

            {/* Badge */}
            <div className="relative z-10 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-4">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm hover:bg-primary/10 transition-colors cursor-default">
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                    Now available for Clinical Researchers
                </div>
            </div>

            {/* Heading */}
            <h1 className="relative z-10 mt-8 max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-forwards opacity-0">
                Research at the <br />
                <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">Speed of Thought</span>
            </h1>

            {/* Subheading */}
            <p className="relative z-10 mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-forwards opacity-0">
                The only privacy-first AI co-pilot built for evidence-based medicine.
                Zero data retention, infinite discovery.
            </p>

            {/* CTAs */}
            <div className="relative z-10 mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-forwards opacity-0">
                <Link href="/login">
                    <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all bg-primary text-primary-foreground group">
                        Get Started Free
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-primary/20 bg-background/50 backdrop-blur-md hover:bg-primary/5 hover:border-primary/50 transition-all group">
                    <PlayCircle className="mr-2 w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    Watch Demo
                </Button>
            </div>

            {/* Mock Dashboard Preview (Conceptual) */}
            <div className="relative z-10 mt-20 w-full max-w-6xl p-2 rounded-xl bg-gradient-to-b from-border/50 to-transparent backdrop-blur-sm animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-forwards opacity-0">
                <div className="rounded-lg bg-background/80 border border-border/50 shadow-2xl shadow-primary/10 overflow-hidden aspect-[16/9] flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5"></div>
                    <div className="text-muted-foreground text-sm font-mono flex flex-col items-center">
                        <span className="text-4xl mb-4">🖥️</span>
                        <span>Interactive Dashboard Preview</span>
                        <span className="text-xs opacity-50 mt-2">(PICO Search • Gap Analysis • Drafting)</span>
                    </div>
                </div>
            </div>

        </section>
    );
}
